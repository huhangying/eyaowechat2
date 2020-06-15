import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Booking, OriginBooking } from '../models/booking.model';
import { BookingStatus } from '../core/enum/booking-status.enum';
import { Schedule } from '../models/schedule.model';
import { map } from 'rxjs/operators';
import { LocalDatePipe } from '../core/pipe/local-date.pipe';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private api: ApiService,
    private localDate: LocalDatePipe,
  ) { }

  // booking

  getBookingsByUser(userid: string) {
    return this.api.get<Booking[]>('bookings/my/user/' + userid);
  }

  createBooking(booking: OriginBooking) {
    return this.api.post<OriginBooking>('booking', booking);
  }

  sendBookingConfirmation(booking: Booking, doctor: Doctor) {
    return this.api.post('wechat/send-booking-msg', {
      openid: booking.user?.link_id,
      data: {
        header: {
          value: '您已经预约成功，详情如下'
        },
        doctor: {
          value: `${doctor?.name} ${doctor?.title}`,
          color: "#173177"
        },
        department: {
          value: doctor?.department?.name,
          color: "#173177"
        },
        datetime: {
          value: `${this.localDate.transform(booking.schedule.date)} ${booking.schedule.period?.name}`,
          color: "#173177"
        },
        address: {
          value: doctor?.department?.address,
          color: "#173177"
        },
        bookingid: {
          value: booking._id,
          color: "#173177"
        },
        footer: {
          value: "请按照指示到相应位置科室就诊"
        }
      }
    });
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
    return this.api.get<{ value: string }>('const/reservation_note').pipe(
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
