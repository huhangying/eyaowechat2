import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Booking } from '../models/booking.model';
import { BookingStatus } from '../core/enum/booking-status.enum';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private api: ApiService,
  ) { }

  getBookingsByUser(userid: string) {
    return this.api.get<Booking[]>('bookings/my/user/' + userid);
  }

  getStatusLabel(status: BookingStatus) {
    switch (status) {
      case BookingStatus.booked:
        return '已预约';
      case BookingStatus.userCancelled:
        return '您已取消预约';
      case BookingStatus.doctorCancelled:
        return '药师已取消预约';
      case BookingStatus.userNotShow:
        return '您未来门诊';
      case BookingStatus.finished:
        return '门诊已完成';
      default:
        return '';
    }
  }
}
