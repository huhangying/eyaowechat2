import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';

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
  ) { }

  ngOnInit(): void {
    this.csIcon = 'assets/' + (this.csDoctor.gender === '男' ? 'male-cs.jpg' : (this.csDoctor.gender === '女' ? 'famale-cs.jpg' : 'cs.jpg'));
  }

  goDetails(doctor: Doctor) {
    this.router.navigate(['/chat'], {
      queryParams: {
        doctorid: doctor._id,
        openid: this.openid,
        state: this.state
      }
    });
  }

}
