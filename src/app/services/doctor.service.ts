import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Doctor } from '../models/doctor.model';
import { map } from 'rxjs/operators';
import { Department } from '../models/department.model';
import { AppStoreService } from '../core/store/app-store.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(
    private api: ApiService,
    private appStore: AppStoreService,
  ) { }

  get doctor() { return this.appStore.doctor; }
  set doctor(val: Doctor) {
    this.appStore.udpateDoctor(val);
  }

  getDoctorById(id: string) {
    return this.api.get<Doctor>('doctor/brief/' + id);
  }

  searchDoctorsByName(name: string) {
    return this.api.get<Doctor[]>('doctors/search/' + name);
  }

  getDoctorsByUser(userid: string) {
    return this.api.get<{ doctor: Doctor }[]>('relationships/get-doctors/user/' + userid).pipe(
      map(docs => docs.map(_ => _.doctor).filter(_doc => _doc.apply && _doc.role < 3)),
      map(docs => this.uniqify(docs, '_id'))
    );
  }

  getScheduleDoctorsByUser(userid: string) {
    return this.api.get<{ doctor: Doctor, apply: boolean }[]>('relationships/get-schedule-doctors/user/' + userid).pipe(
      map(doc => doc.filter(_ => _.apply).map(_ => _.doctor).filter(_doc => _doc.apply && _doc.role < 3)),
      map(docs => this.uniqify(docs, '_id'))
    );
  }

  checkRelationshipExisted(did: string, uid: string) {
    return this.api.get<{ existed: boolean }>(`relationship/${did}/${uid}`).pipe(
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

  getCsDoctorIcon(gender?: string) {
    return 'assets/' + (gender === '男' ? 'male-cs.jpg' : (gender === '女' ? 'female-cs.jpg' : 'cs.jpg'));
  }

  
  // Hospital
  getCustomerServiceInfo() {
    return this.api.get<{ _id: string; csdoctor: Doctor }>('hospital/customer-service');
  }

  //--------------------------
  private uniqify(array, key) {
    return array.reduce((prev, curr) => prev.find(a => a[key] === curr[key]) ? prev : prev.push(curr) && prev, []);
  }
}
