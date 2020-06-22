import { Schedule } from './schedule.model';
import { User } from './user.model';

// flatten booking
export interface Booking {
  _id?: string;
  doctor: string; // id
  schedule?: Schedule; // id
  date?: Date; // same as in schedule
  user?: User;
  status: number;
  created?: Date;
  score?: number;
}

export interface OriginBooking {
  _id?: string;
  doctor: string; // id
  schedule?: string; // id
  date?: Date; // same as in schedule
  user?: string; // id
  status: number;
  created?: Date;
  score?: number;
}
