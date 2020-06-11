import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Booking, OriginBooking } from '../models/booking.model';
import { BookingStatus } from '../core/enum/booking-status.enum';
import { Schedule } from '../models/schedule.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private api: ApiService,
  ) { }

  // booking

  getBookingsByUser(userid: string) {
    return this.api.get<Booking[]>('bookings/my/user/' + userid);
  }

  createBooking(booking: OriginBooking) {
    return this.api.post<OriginBooking>('booking', booking);
  }

  // schedule

  getSchedulesByDoctor(doctorid: string) {
    return this.api.get<Schedule[]>('schedules/' + doctorid);
  }

  getOneWeekSchedules(doctorid: string, startDate) {
    return this.api.get<Schedule[]>('schedules/find-a-week/' + doctorid + '/' + startDate);
  }

  // functions

  getGlobalReservationNote() {
    return this.api.get<{value: string}>('const/reservation_note').pipe(
      map(result => result?.value)
    )
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
