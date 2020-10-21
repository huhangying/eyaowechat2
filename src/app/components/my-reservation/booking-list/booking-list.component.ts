import { Component, OnInit, Input } from '@angular/core';
import { Booking } from 'src/app/models/booking.model';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core.service';
import { BookingDetailsComponent } from '../booking-details/booking-details.component';
import { BookingService } from 'src/app/services/booking.service';
import { AppStoreService } from 'src/app/core/store/app-store.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  @Input() bookings: Booking[];
  @Input() user: User;

  constructor(
    private router: Router,
    private appStore: AppStoreService,
    private core: CoreService,
    public dialog: MatDialog,
    private bookingService: BookingService,
  ) { }

  ngOnInit(): void {
  }

  goDetails(booking: Booking) {
    if (booking.status === 4 && !this.bookingService.isBookingExpired(new Date(), booking.schedule.date)) {
      // redirect to 
      this.router.navigate(['/booking-forward'], {
        queryParams: {
          openid: this.appStore.token?.openid ||this.user.link_id,
          state: this.appStore.hid,
          id: `|${booking._id}`
        }
      });
      return;
    }

    const currentTitle = this.core.getTitle();
    this.dialog.open(BookingDetailsComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        booking: booking,
        user: this.user
      }
    }).afterClosed().subscribe((result) => {
      if (result?._id) {
        // refresh data
        const updatedBooking = this.bookings.find(_ => _._id === result._id);
        updatedBooking.status = result.status;
      }
      this.core.setTitle(currentTitle);
    });
  }

}
