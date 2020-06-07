import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/booking.model';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  booking: Booking;
  user: User;

  constructor(
    private router: Router,
    private core: CoreService,
  ) {
    this.booking = this.router.getCurrentNavigation().extras.state?.booking || {};
    this.user = this.router.getCurrentNavigation().extras.state?.user;
  }

  ngOnInit(): void {
    this.core.setTitle('预约详情');
  }

  goBack() {
    this.router.navigate(['/my-reservation'], { queryParams: { openid: this.user.link_id } })
  }

}
