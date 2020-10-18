import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DoctorConsult } from '../../models/consult/doctor-consult.model';
import { ConsultService } from '../consult.service';

@Injectable({
    providedIn: 'root'
})
export class DoctorConsultResolver implements Resolve<DoctorConsult> {
    constructor(
        private consultService: ConsultService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.consultService.getDoctorConsultByDoctorId(route.queryParams.doctorid);
    }
}
