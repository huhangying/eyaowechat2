import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Doctor } from '../../models/doctor.model';
import { DoctorService } from '../doctor.service';


@Injectable({
    providedIn: 'root'
})
export class CustomerServiceDoctorResolver implements Resolve<Doctor> {
    constructor(
        private doctorService: DoctorService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // 获取客服药师
        return this.doctorService.getCustomerServiceInfo().pipe(
            map(result => {
                return {
                    ...result.csdoctor,
                    isCustomerService: true
                };
            })
        )
    }
}
