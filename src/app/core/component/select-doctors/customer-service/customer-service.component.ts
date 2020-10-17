import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-customer-service',
  templateUrl: './customer-service.component.html',
  styleUrls: ['./customer-service.component.scss']
})
export class CustomerServiceComponent implements OnInit {
  @Input() csDoctor: Doctor;
  @Input() openid: string;
  @Input() state: number;
  csIcon: string;

  constructor(
    private router: Router,
    private doctorService: DoctorService,
  ) { }

  ngOnInit(): void {
    this.csIcon = this.doctorService.getCsDoctorIcon(this.csDoctor.gender);
  }

  goCsChatDetails(doctor: Doctor) {
    this.router.navigate(['/chat'], {
      queryParams: {
        doctorid: doctor._id,
        openid: this.openid,
        state: this.state,
        cs: true
      }
    });
  }

}
