
export interface User {
  _id: string;
  user_id: string;
  link_id?: string;
  cell?: string;
  name: string;

  role?: number;
  icon?: string;
  gender?: string;

  birthdate?: Date;
  sin?: string;
  admissionNumber?: string;
  visitedDepartments?: string[]; // department ids, 用来判定应该使用初诊问卷还是复诊问卷

  department?: string;
  title?: string;

  msgInQueue?: number;
  updated?: Date;
}
