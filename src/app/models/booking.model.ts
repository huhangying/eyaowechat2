import { Schedule } from './schedule.model';
import { User } from './user.model';

// flatten booking
export interface Booking {
  _id: string;
  doctor: string; // id
  schedule?: Schedule; // id
  user?: User; // id
  status: number;
  created?: Date;
  score?: number;
}
