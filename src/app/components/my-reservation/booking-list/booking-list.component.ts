import { Component, OnInit, Input } from '@angular/core';
import { Booking } from 'src/app/models/booking.model';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core.service';
import { BookingDetailsComponent } from '../booking-details/booking-details.component';

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
    private core: CoreService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  goDetails(booking: Booking) {
    const currentTitle = this.core.getTitle();
    this.dialog.open(BookingDetailsComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        booking: booking,
        user: this.user
      }
    }).afterClosed().subscribe(() => {
      this.core.setTitle(currentTitle);
    });
  }

}
