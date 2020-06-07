import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Booking } from '../models/booking.model';

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
}
