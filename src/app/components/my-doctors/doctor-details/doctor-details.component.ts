import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss']
})
export class DoctorDetailsComponent implements OnInit {
  doctor: Doctor;

  constructor(
    private router: Router,
    private core: CoreService,
  ) {
    this.doctor = this.router.getCurrentNavigation().extras.state?.data || {};
   }

  ngOnInit(): void {
    this.core.setTitle('医生首页');
  }

}
