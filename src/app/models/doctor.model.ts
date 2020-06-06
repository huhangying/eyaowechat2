import { Department } from './department.model';

export interface Doctor {
  _id: string;
  name: string;
  role?: number;
  department?: Department; //string; //id
  title?: string;
  tel?: string; // to remove
  cell?: string;// to remove
  gender?: string;
  hours?: string;
  expertise?:  string;
  bulletin?: string;
  honor?: string;
  icon?: string;
  status?: number;  // 0: idle, 1: busy; 2: away; 3: offline
}

export interface DoctorWrap {
  doctor: Doctor;
}
