import { SurveyGroup } from './survey/survey-group.model';
import { Medicine } from './medicine/medicine.model';
import { MedicineNotice } from './medicine/medicine-notice.model';
import { Doctor } from './doctor.model';

export interface Diagnose {
  _id?: string;
  doctor: Doctor; // id
  user: string; // id
  booking?: string; // id

  // surveys?: { type: number; list: Survey[] }[];
  surveys?: SurveyGroup[];
  // assessment:
  prescription?: Medicine[];
  notices?: MedicineNotice[];

  labResults?: string[]; // ids

  status?: DiagnoseStatus; // 0: assigned to user;  1: user finished; 2: doctor saved; 3: archived
  updatedAt?: Date;
}

export enum DiagnoseStatus {
  assignedToUser = 0,
  userFinished = 1,
  doctorSaved = 2,
  archived = 3
}
