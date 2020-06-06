import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Doctor, DoctorWrap } from '../models/doctor.model';
import { map } from 'rxjs/operators';
import { Department } from '../models/department.model';

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

  checkRelationshipExisted(did: string, uid: string) {
    return this.api.get<{existed: boolean}>(`relationship/${did}/${uid}`).pipe(
      map(_ => _.existed)
    );
  }

  addRelationship(did: string, uid: string) {
    return this.api.post('relationship', {
      doctor: did,
      user: uid
    });
  }

  removeRelationship(did: string, uid: string) {
    return this.api.delete(`relationship/remove/${did}/${uid}`);
  }

  getDepartments() {
    return this.api.get<Department[]>('departments');
  }

  getDoctorsByDepartmentId(departmentid: string) {
    return this.api.get<Doctor[]>('doctors/department/' + departmentid);
  }
}
