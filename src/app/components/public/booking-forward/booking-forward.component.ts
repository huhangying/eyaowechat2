import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { BookingService } from 'src/app/services/booking.service';
import { tap, takeUntil } from 'rxjs/operators';
import { Booking, OriginBooking } from 'src/app/models/booking.model';
import { User } from 'src/app/models/user.model';
import { MessageService } from 'src/app/core/services/message.service';
import { SocketioService } from 'src/app/core/services/soketio.service';
import * as moment from 'moment';

@Component({
  selector: 'app-booking-forward',
  templateUrl: './booking-forward.component.html',
  styleUrls: ['./booking-forward.component.scss']
})
export class BookingForwardComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  expired = false;
  done = false; // 处理标识

  booking: Booking;
  forwardBooking: Booking;
  user: User;
  now = new Date();
  room: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private core: CoreService,
    private bookingService: BookingService,
    private message: MessageService,
    private socket: SocketioService,
  ) {
    this.route.data.pipe(
      tap(async data => {
        const { id } = this.route.snapshot.queryParams;
        const bookingIds = id.split('|');
        if (bookingIds.length > 1) { // booking id and forward booking id
          this.user = data.user;
          const forward_booking = await this.bookingService.getBookingById(bookingIds[1]).toPromise();
          if (forward_booking?._id) {
            this.forwardBooking = forward_booking;
          }

          // check if forward_booking expiry
          // 如果不能替换今天的预约， 0 改成 -1 ??? 
          if (this.bookingService.isBookingExpired(this.now, forward_booking.schedule.date, 0)) {
            this.expired = true;
            return;
          }

          if (bookingIds[0]) {
            const booking = await this.bookingService.getBookingById(bookingIds[0]).toPromise();
            if (booking?._id) {
              if (booking.status !== 4) {
                this.done = true;
                return;
              }

              this.booking = booking;
              // 建立发送noti的通道
              if (this.socket.joinRoom)
                this.room = this.booking.doctor; // room id is doctor id
              this.socket.joinRoom(this.room);
            }
          }
        } else {
          this.expired = true;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();

  }

  ngOnInit(): void {
    this.core.setTitle('确定替换药师');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    if (this.room) {
      this.socket.leaveRoom(this.room);
    }
  }

  replaceBooking() {
    // 取消原booking
    this.booking && this.bookingService.cancelBooking(this.booking).subscribe(
      booking => {
        this.socket.sendBooking(this.booking.doctor, booking, this.user.name);
      }
    );

    // 设置替换booking： status = 1
    this.bookingService.setBookingStatus(this.forwardBooking, 1).subscribe(
      result => {
        if (result) {
          this.message.success('您已经成功替换预约药师！');

          this.redirectMyBookings();
        }
      }
    );;

  }
  cancelBooking() {
    // 取消原booking
    this.booking && this.bookingService.cancelBooking(this.booking).subscribe(
      booking => {
        this.socket.sendBooking(this.booking.doctor, booking, this.user.name);
      }
    );

    // 设置替换booking: status = 0
    this.bookingService.setBookingStatus(this.forwardBooking, 0).subscribe(
      result => {
        if (result) {
          this.message.success('您的预约已经成功取消！');

          this.redirectMyBookings(true);
        }
      }
    );
  }

  close() {
    this.redirectMyBookings(true);
  }

  redirectMyBookings(goFinished: boolean = false) {
    this.router.navigate(['/my-reservation'], {
      queryParams: {
        openid: this.route.snapshot.queryParams.openid,
        state: this.route.snapshot.queryParams.state,
        finished: goFinished
      }
    });
  }

  originalBookingDoctorLabel(booking: Booking) {
    return booking?.schedule?.doctor ?
      (booking.schedule.doctor.name + ' ' + booking.schedule.doctor.title) :
      '原预约药师';
  }

}
