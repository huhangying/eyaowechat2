import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { BookingService } from 'src/app/services/booking.service';
import { tap, takeUntil } from 'rxjs/operators';
import { Booking } from 'src/app/models/booking.model';
import { User } from 'src/app/models/user.model';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-booking-forward',
  templateUrl: './booking-forward.component.html',
  styleUrls: ['./booking-forward.component.scss']
})
export class BookingForwardComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  loaded = false;
  booking: Booking;
  forwardBooking: Booking;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private bookingService: BookingService,
    private message: MessageService,
  ) {
    this.route.data.pipe(
      tap(async data => {
        const { id } = this.route.snapshot.queryParams;
        const bookingIds = id.split('|');
        if (bookingIds.length > 1) { // booking id and forward booking id
          const forward_booking = await this.bookingService.getBookingById(bookingIds[1]).toPromise();

          //todo: check forward_booking valid. redirect if not

          const booking = await this.bookingService.getBookingById(bookingIds[0]).toPromise();
          this.loaded = true;
          if (booking?._id && forward_booking?._id) {
            this.user = data.user;
            this.booking = booking;
            this.forwardBooking = forward_booking;
            // this.goDetails(booking, forward_booking, data.user);
            return;
          }
        } else {
          this.loaded = true;
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
  }

  replaceBooking() {
    // 取消原booking
    this.bookingService.cancelBooking(this.booking).subscribe();

    // 设置替换booking： status = 1
    this.bookingService.setBookingStatus(this.forwardBooking, 1).subscribe(
      result => {
        if (result) {
          this.message.success('您已经成功替换预约药师！');
          //todo:

        }
      }
    );;
    
  }
  cancelBooking() {
    // 取消原booking
    this.bookingService.cancelBooking(this.booking).subscribe();

    // 设置替换booking: status = 0
    this.bookingService.setBookingStatus(this.forwardBooking, 0).subscribe(
      result => {
        if (result) {
          this.message.success('您的预约已经成功取消！');
          //todo:
          
        }
      }
    );
  }

}
