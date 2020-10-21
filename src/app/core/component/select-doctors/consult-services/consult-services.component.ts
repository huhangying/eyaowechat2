import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStoreService } from 'src/app/core/store/app-store.service';
import { ConsultServicePrice } from 'src/app/models/consult/doctor-consult.model';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-consult-services',
  templateUrl: './consult-services.component.html',
  styleUrls: ['./consult-services.component.scss']
})
export class ConsultServicesComponent implements OnInit {
  @Input() doctor: Doctor;
  @Input() openid: string;
  @Input() state: number;

  constructor(
    private router: Router,
    private appStore: AppStoreService,
    private doctorService: DoctorService,
  ) { 
  }

  ngOnInit(): void {
  }

  goConsult(consultType: number) { // consultType: 0: 图文咨询； 1：电话咨询
    this.doctorService.doctor = this.doctor;
    this.router.navigate(['/consult'], {
      queryParams: {
        doctorid: this.doctor._id,
        openid: this.appStore.token?.openid || this.openid,
        state: this.appStore.hid || this.state,
        type: (consultType === 0 || consultType === 1) ? consultType : undefined
      }
    });
  }

  goChat() {
    this.doctorService.doctor = this.doctor;
    this.router.navigate(['/chat'], {
      queryParams: {
        doctorid: this.doctor._id,
        openid: this.appStore.token?.openid || this.openid,
        state: this.appStore.hid || this.state,
      }
    });
  }

  getServicePriceByType(servicePrices: ConsultServicePrice[], type: number) {
    if (!servicePrices?.length) return null;
    return servicePrices.find(sp => sp && sp.type === type);
  }
}
