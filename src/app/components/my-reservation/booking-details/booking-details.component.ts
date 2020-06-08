import { Component, OnInit, Inject, Optional, SkipSelf } from '@angular/core';
import { Booking } from 'src/app/models/booking.model';
import { CoreService } from 'src/app/core/services/core.service';
import { User } from 'src/app/models/user.model';
import { BookingService } from 'src/app/services/booking.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  booking: Booking;
  user: User;

  constructor(
    private core: CoreService,
    private bookingService: BookingService,
    public dialogRef: MatDialogRef<BookingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: { 
      booking: Booking,
      user: User,
    },
  ) {
    this.booking = data.booking;
    this.user = data.user;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.core.setTitle('预约详情');
  }

  close() {
    this.dialogRef.close();
  }

  getBookingStatus(status) {
    return this.bookingService.getStatusLabel(status);
  }
}
