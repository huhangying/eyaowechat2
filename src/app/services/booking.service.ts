import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Booking, OriginBooking } from '../models/booking.model';
import { BookingStatus } from '../core/enum/booking-status.enum';
import { Schedule } from '../models/schedule.model';
import { map } from 'rxjs/operators';
import { LocalDatePipe } from '../core/pipe/local-date.pipe';
import { Doctor } from '../models/doctor.model';
import * as moment from 'moment';

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

  cancelBooking(booking: Booking) {
    return this.api.patch<OriginBooking>('booking/' + booking._id, { status: 2 }); // 2: 取消预约
  }

  setBookingStatus(booking: Booking, status: number) {
    return this.api.patch<OriginBooking>('booking/' + booking._id, { status: status });
  }

  getBookingById(id: string) {
    return this.api.get<Booking>('booking/' + id);
  }

  sendBookingConfirmation(booking: Booking, doctor: Doctor) {
    return this.api.post('wechat/send-wechat-msg',
      this.buildBookingConfirmationMsg('booking_success_template', booking, doctor, '您已经预约成功，详情如下', "请按照指示到相应位置科室就诊"));
  }

  sendBookingCancellation(booking: Booking, doctor: Doctor) {
    return this.api.post('wechat/send-wechat-msg',
      this.buildBookingConfirmationMsg('booking_cancel_template', booking, doctor, '您的预约已经取消，详情如下', ""));
  }

  // 
  buildBookingConfirmationMsg(templateId, booking: Booking, doctor: Doctor, header: string, footer: string) {
    return {
      templateid: templateId,
      openid: booking.user?.link_id,
      bookingid: booking._id,
      data: {
        first: {
          value: header
        },
        keyword1: {
          value: `${doctor?.name} ${doctor?.title}`,
          color: "#173177"
        },
        keyword2: {
          value: doctor?.department?.name,
          color: "#173177"
        },
        keyword3: {
          value: `${this.localDate.transform(booking.schedule.date)} ${booking.schedule.period?.name}`,
          color: "#173177"
        },
        keyword4: {
          value: doctor?.department?.address,
          color: "#173177"
        },
        keyword5: {
          value: booking._id,
          color: "#173177"
        },
        remark: {
          value: footer
        }
      }
    };
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
      case BookingStatus.pending:
        return '药师替换等待确认';
      case BookingStatus.finished:
        return '门诊已完成';
      case BookingStatus.confirmFinished:
        return '设置完成';
      default:
        return '';
    }
  }

  isBookingExpired(now: Date, bookingDate: Date, offset = 0) {
    return moment(now).isSameOrAfter(moment(bookingDate).clone().add(offset + 1, 'd')); //当天的预约不算成过期
  }
}
