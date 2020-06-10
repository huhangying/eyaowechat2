import { Component, OnInit, Input } from '@angular/core';
import { PageType } from 'src/app/core/enum/page.enum';
import { Doctor } from 'src/app/models/doctor.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-select-doctors',
  templateUrl: './select-doctors.component.html',
  styleUrls: ['./select-doctors.component.scss']
})
export class SelectDoctorsComponent implements OnInit {
  @Input() pageType: PageType;
  @Input() user: User;
  @Input() doctors: Observable<Doctor[]>;

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  goDoctorDetails(doctor: Doctor) {
    this.router.navigate(['/doctor-details'], 
      {state: {doctor: doctor, userid: this.user._id}});
  }

  goChat(doctor: Doctor) {
    this.router.navigate(['/chat'], 
      {state: {doctor: doctor, user: this.user}});
  }

  goBook(doctor: Doctor) {
    this.router.navigate(['/book'], 
      {state: {doctor: doctor, user: this.user}});
  }
}
