import { Doctor } from './doctor.model';

export interface Schedule {
  _id: string;
  doctor: Doctor;
  period: Period; 
  // period: Period;
  date: Date;
  limit?: number;
  created?: Date;
  apply?: boolean;
}

export interface Period {
  _id: string;
  name: string;
  from?: number;
  to?: number;
  order?: number;
}