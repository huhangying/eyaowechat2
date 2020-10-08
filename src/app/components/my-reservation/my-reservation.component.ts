import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from 'src/app/models/booking.model';
import { BookingService } from 'src/app/services/booking.service';
import { CoreService } from 'src/app/core/services/core.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Subject, Observable } from 'rxjs';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { AppStoreService } from 'src/app/core/store/app-store.service';

@Component({
  selector: 'app-my-reservation',
  templateUrl: './my-reservation.component.html',
  styleUrls: ['./my-reservation.component.scss']
})
export class MyReservationComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  bookings: Booking[];
  selectedTabIndex: 0|1;
  now = new Date();

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private core: CoreService,
    private appStore: AppStoreService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        if (this.user) {
          this.bookingService.getBookingsByUser(this.user._id).pipe(
            tap(results => {
              this.bookings = results || [];
            })
          ).subscribe();
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    // set default tab selection
    this.route.queryParams.pipe(
      tap(params => {
        if (params?.finished) {
          this.selectedTabIndex = params.finished === 'true' ? 1 : 0;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('我的预约');
    if (this.appStore.token?.openid) {
      this.core.replaceUrlWithOpenid(this.route.routeConfig.path, this.appStore.token.openid, this.appStore.hid);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  get finishedBookings() {
    return this.bookings ?
      this.bookings.filter(_ => !(_.status === 1 || _.status === 4) || this.bookingService.isBookingExpired(this.now, _.schedule.date)) :
      [];
  }

  get currentBookings() {
    return this.bookings ?
      this.bookings.filter(_ => _.status === 1 && !this.bookingService.isBookingExpired(this.now, _.schedule.date)) :
      [];
  }
  
}
