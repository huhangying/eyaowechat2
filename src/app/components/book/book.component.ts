import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { BookingService } from 'src/app/services/booking.service';
import { Schedule } from 'src/app/models/schedule.model';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';
import { tap, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/message.service';
import { OriginBooking, Booking } from 'src/app/models/booking.model';
import { SurveyService } from 'src/app/services/survey.service';
import { SurveyReqest } from 'src/app/models/survey/survey.model';
import { WeixinService } from 'src/app/services/weixin.service';
import { environment } from 'src/environments/environment';
import { AppStoreService } from 'src/app/core/store/app-store.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  doctor: Doctor;
  user: User;
  schedules$: Observable<Schedule[]>;
  scheduleSelected = true;
  reservationNote: string;
  currentStartWeekDay = moment().add(1, 'd').startOf('week'); // 从明天开始预约
  fromDate: moment.Moment;
  day0: boolean;
  day1: boolean;
  day2: boolean;
  day3: boolean;
  day4: boolean;
  day5: boolean;
  day6: boolean;
  oneWeekSchedules: Schedule[];
  availableSchedules: Schedule[];
  selectedDay: number = -1;


  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private bookingService: BookingService,
    private surveyService: SurveyService,
    private wxService: WeixinService,
    private appStore: AppStoreService,
    private cd: ChangeDetectorRef,
    private message: MessageService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    if (this.doctor?._id) {
      // get schedules
      this.schedules$ = this.bookingService.getSchedulesByDoctor(this.doctor._id);
      this.bookingService.getGlobalReservationNote().subscribe(result => {
        this.reservationNote = result?.replace(/\n/g, '<br>');
      });
    }

    this.fromDate = this.currentStartWeekDay.clone();
    this.fetchSchedule();
  }

  ngOnInit(): void {
    this.core.setTitle(this.doctor.name + '门诊预约');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  nextWeek() {
    // 只允许查看预约 7 天内
    if (this.fromDate.isSameOrBefore(this.currentStartWeekDay)) {
      this.fromDate.add(7, 'd');
      this.fetchSchedule();
    } else {
      this.message.toast('只能预约7天内的药师门诊');
    }
  }

  prevWeek() {
    // 只允许查看预约 7 天内
    if (this.fromDate.isAfter(this.currentStartWeekDay)) {
      this.fromDate.subtract(7, 'd');
      this.fetchSchedule();
    } else {
      this.message.toast('只能预约7天内的药师门诊');
    }
  }

  fetchSchedule() {
    if (!this.doctor?._id) return;
    const startDate = this.fromDate.format('YYYY-MM-DD');
    this.bookingService.getOneWeekSchedules(this.doctor._id, startDate).pipe(
      tap(results => {
        this.oneWeekSchedules = results;
        this.day0 = this.checkAvailable();
        this.day1 = this.checkAvailable(1);
        this.day2 = this.checkAvailable(2);
        this.day3 = this.checkAvailable(3);
        this.day4 = this.checkAvailable(4);
        this.day5 = this.checkAvailable(5);
        this.day6 = this.checkAvailable(6);
        this.availableSchedules = [];
        this.selectedDay = -1;
        this.cd.markForCheck();
      })
    ).subscribe();
  }

  getDay(offset = 0) {
    return this.fromDate.clone().add(offset, 'd').format('DD');
  }

  get yearMonth() {
    return this.fromDate.format('YYYY年 M月')
  }

  checkAvailable(offset = 0) {
    if (!this.oneWeekSchedules?.length) {
      return false;
    }
    const date = this.fromDate.clone().add(offset, 'd');
    // check if reaching min
    if (date.isBefore(moment().add(-1, 'd'))) { //todo: allow book today, change -1 to 0 later
      return false;
    }
    // check if reaching max
    if (date.isAfter(moment().add(7, 'd'))) {
      return false;
    }
    return this.oneWeekSchedules.findIndex(schedule => {
      return date.date() === moment(schedule.date).date();
    }) > -1;
  }

  select(offset = 0, available = false) {
    this.selectedDay = offset;
    if (!available) {
      this.availableSchedules = [];
      // this.selectedDay = -1;
      return;
    }
    const date = this.fromDate.clone().add(offset, 'd');
    this.availableSchedules = this.oneWeekSchedules.filter(schedule => {
      return date.date() === moment(schedule.date).date();
    });
  }

  resetWeek() {

  }

  book(schedule: Schedule) {
    //todo: check double book

    this.bookingService.createBooking({
      doctor: this.doctor._id,
      user: this.user._id,
      schedule: schedule._id,
      date: schedule.date,
      status: 1, //1: 预约完成,可用状态
      created: new Date(),
    }).pipe(
      tap((result: OriginBooking) => {
        if (result) {
          // decrease limit number of the schedule
          this.availableSchedules = this.availableSchedules.map(schedule => {
            if (schedule._id === result.schedule) {
              schedule.limit--;
            }
            return schedule;
          });

          this.message.success('预约成功！');

          // send user booking message
          const booking: Booking = {
            _id: result._id,
            doctor: this.doctor._id,
            schedule: schedule,
            date: schedule.date,
            user: this.user,
            status: result.status
          };

          this.bookingService.sendBookingConfirmation(booking, this.doctor).subscribe();

          // 发送初诊问卷或复诊问卷
          if (booking) {
            const surveyType = this.isFirstVisit ? 1 : 2; // 1: 初诊; 2: 复诊问卷
            // check if a survey has been sent
            this.surveyService.getPendingSurveysByUserAndType(this.doctor._id, this.user._id, surveyType).pipe(
              tap(results => {
                // 取初诊或复诊问卷, 如果没有的话,
                // 1. create a survey
                // 2. send user a message
                if (!results?.length) {

                  // cread survey from template
                  // const surveys = [];
                  this.surveyService.getByDepartmentIdAndType(this.doctor.department?._id, surveyType).pipe(
                    tap(results => {
                      if (!results?.length) return;
                      // create surveys from template
                      const surveys = results.map(async (_: SurveyReqest) => {
                        delete _.createdAt;
                        delete _.updatedAt;
                        const newSurvey: SurveyReqest = {
                          ..._,
                          surveyTemplate: _._id,
                          user: this.user._id,
                          doctor: this.doctor._id,
                          finished: false,
                          availableBy: new Date(moment().add(30, 'days').format()) //todo: general util function
                        };
                        delete newSurvey._id;
                        // create survey
                        return await this.surveyService.addSurvey(newSurvey).toPromise();
                      });
                      console.log(surveys);
                      //
                      const surveyName = surveyType === 1 ? '初诊问卷' : '复诊问卷';
                      this.wxService.sendUserMsg(
                        this.user.link_id,
                        surveyName,
                        `请填写${surveyName}， 谢谢配合！`,
                        `${environment.wechatServer}survey-start?openid=${this.user.link_id}&state=${this.appStore.hid}&doctorid=${this.doctor._id}&type=${surveyType}&date=${moment().toISOString()}`,
                        ''
                      ).subscribe();
                    })
                  ).subscribe();
                }
              })
            ).subscribe();
          }

          this.cd.markForCheck();
        }
      })
    ).subscribe();
  }

  get isFirstVisit() {
    if (!this.user?.visitedDepartments?.length) return true;
    return !this.user.visitedDepartments.find(_ => _ === this.doctor.department?._id);
  }

}
