import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from 'src/app/models/booking.model';
import { BookingService } from 'src/app/services/booking.service';
import { CoreService } from 'src/app/core/services/core.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Subject, Observable } from 'rxjs';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-reservation',
  templateUrl: './my-reservation.component.html',
  styleUrls: ['./my-reservation.component.scss']
})
export class MyReservationComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  bookings: Booking[];

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private core: CoreService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        if (this.user) {
          this.bookingService.getBookingsByUser(this.user._id).pipe(
            tap(results => {
              this.bookings = results || [];
            })
          ).subscribe();
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

  get finishedBookings() {
    return this.bookings ?
      this.bookings.filter(_ => _.status > 1) :
      [];
  }

  get currentBookings() {
    return this.bookings ?
      this.bookings.filter(_ => _.status === 1) :
      [];
  }

}
