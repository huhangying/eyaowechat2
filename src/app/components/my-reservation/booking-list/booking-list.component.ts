import { Component, OnInit, Input } from '@angular/core';
import { Booking } from 'src/app/models/booking.model';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  @Input() bookings: Booking[];
  @Input() user: User;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  goDetails(booking: Booking) {
    this.router.navigate(['/booking-details'], {
      state: { booking: booking, user: this.user }
    });
  }

}
