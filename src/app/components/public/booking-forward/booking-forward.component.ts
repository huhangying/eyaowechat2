import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { BookingService } from 'src/app/services/booking.service';
import { tap, takeUntil } from 'rxjs/operators';
import { Booking } from 'src/app/models/booking.model';
import { User } from 'src/app/models/user.model';

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
  ) {
    this.route.data.pipe(
      tap(async data => {
        const { id } = this.route.snapshot.queryParams;
        const bookingIds = id.split('|');
        if (bookingIds.length > 1) { // booking id and forward booking id
          const booking = await this.bookingService.getBookingById(bookingIds[0]).toPromise();
          const forward_booking = await this.bookingService.getBookingById(bookingIds[1]).toPromise();
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
    this.core.setTitle('我的预约');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  // goDetails(booking: Booking, forwardBooking: Booking, user: User) {

  // }

}
