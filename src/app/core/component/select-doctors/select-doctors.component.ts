import { Component, OnInit, Input } from '@angular/core';
import { PageType } from 'src/app/core/enum/page.enum';
import { Doctor } from 'src/app/models/doctor.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-doctors',
  templateUrl: './select-doctors.component.html',
  styleUrls: ['./select-doctors.component.scss']
})
export class SelectDoctorsComponent implements OnInit {
  @Input() pageType: PageType;
  @Input() userid: string;
  @Input() doctors: Observable<Doctor[]>;

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  doctorDetails(doctor: Doctor) {
    this.router.navigate(['/doctor-details'], 
      {state: {doctor: doctor, userid: this.userid}});
  }
}
