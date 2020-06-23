import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { Booking } from 'src/app/models/booking.model';
import { BookingDetailsComponent } from '../../my-reservation/booking-details/booking-details.component';
import { BookingService } from 'src/app/services/booking.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    public dialog: MatDialog,
    private bookingService: BookingService,
  ) {
    this.route.data.pipe(
      tap(async data => {
        const { id } = this.route.snapshot.queryParams;
        if (id) { // booking id
          const booking = await this.bookingService.getBookingById(id).toPromise();
          this.loaded = true;
          if (booking?._id) {
            this.goDetails(booking, data.user);
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

  goDetails(booking: Booking, user: User) {
    this.dialog.open(BookingDetailsComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        booking: booking,
        user: user,
        noReturn: true
      }
    });
  }

}
