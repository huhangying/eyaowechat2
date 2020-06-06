import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Doctor, DoctorWrap } from '../models/doctor.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(
    private api: ApiService,
  ) { }

  getDoctorsByUser(userid: string) {
    return this.api.get<{doctor: Doctor}[]>('relationships/get-doctors/user/' + userid).pipe(
      map(doc => doc.map(_ => _.doctor))
    );
  }
}
