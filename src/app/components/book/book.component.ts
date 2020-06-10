import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { BookingService } from 'src/app/services/booking.service';
import { Schedule } from 'src/app/models/schedule.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  doctor: Doctor;
  user: User;
  schedules$: Observable<Schedule[]>;

  constructor(
    private router: Router,
    private core: CoreService,
    private bookingService: BookingService,
  ) { 
    this.doctor = this.router.getCurrentNavigation().extras.state?.doctor || {};
    this.user = this.router.getCurrentNavigation().extras.state?.user;

    if (this.doctor?._id) {
      // get schedules
      this.schedules$ = this.bookingService.getSchedulesByDoctor(this.doctor._id);
    }

  }

  ngOnInit(): void {
    this.core.setTitle(this.doctor.name);
  }

}
