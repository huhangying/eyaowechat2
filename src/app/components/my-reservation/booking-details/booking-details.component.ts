import { Component, OnInit, Inject, Optional, SkipSelf, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Booking, OriginBooking } from 'src/app/models/booking.model';
import { CoreService } from 'src/app/core/services/core.service';
import { User } from 'src/app/models/user.model';
import { BookingService } from 'src/app/services/booking.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Doctor } from 'src/app/models/doctor.model';
import { MessageService } from 'src/app/core/services/message.service';
import { BookingStatus } from 'src/app/core/enum/booking-status.enum';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingDetailsComponent implements OnInit {
  booking: Booking;
  user: User;
  doctor: Doctor;
  now = new Date();

  constructor(
    private core: CoreService,
    private bookingService: BookingService,
    private cd: ChangeDetectorRef,
    private message: MessageService,
    public dialogRef: MatDialogRef<BookingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: {
      booking: Booking,
      user: User,
      noReturn?: boolean
    },
  ) {
    this.booking = data.booking;
    this.user = data.user;
    this.doctor = data.booking.schedule?.doctor;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.core.setTitle('预约详情');
    this.cd.markForCheck();
  }

  close() {
    this.dialogRef.close();
  }


  getBookingStatus(status, bookingDate: Date) {
    if ([BookingStatus.doctorCancelled, BookingStatus.userCancelled, BookingStatus.finished, BookingStatus.confirmFinished].indexOf(status) > -1) {
      return this.bookingService.getStatusLabel(status);
    }
    // check expiry
    if (this.isBookingExpired(bookingDate)) {
      return '预约已过期';
    }
    return this.bookingService.getStatusLabel(status);
  }

  isBookingExpired(bookingDate: Date) {
    return this.bookingService.isBookingExpired(this.now, bookingDate);
  }
 
  cancelBook(booking: Booking) {
    return this.bookingService.cancelBooking(booking).pipe(
      tap((result: OriginBooking) => {
        if (result?._id) {
          // send wechat msg
          booking.user = this.user;
          this.bookingService.sendBookingCancellation(booking, this.doctor).subscribe();
          this.message.success('您的预约已经成功取消！');
          this.dialogRef.close(result);
        }
      })
    ).subscribe();
  }
}
