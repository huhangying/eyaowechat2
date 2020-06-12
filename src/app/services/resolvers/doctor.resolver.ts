import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from '../doctor.service';


@Injectable({
    providedIn: 'root'
})
export class DoctorResolver implements Resolve<Doctor> {
    constructor(
        private doctorService: DoctorService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.doctorService.doctor ?
            of(this.doctorService.doctor) :
            this.doctorService.getDoctorById(route.queryParams.doctorid);
    }
}
