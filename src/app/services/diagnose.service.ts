import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Diagnose } from '../models/diagnose.model';

@Injectable({
  providedIn: 'root'
})
export class DiagnoseService {

  constructor(
    private api: ApiService,
  ) { }

  getUserDiagnoseHistory(userid: string) {
    return this.api.get<Diagnose[]>('diagnoses/history/' + userid);
  }

  getUserCurrentDiagnose(userid: string) {
    return this.api.get<Diagnose>('diagnose/history/latest/' + userid);
  }

  getDiagnoseById(id: string) {
    return this.api.get<Diagnose>('diagnose/' + id);
  }

}
