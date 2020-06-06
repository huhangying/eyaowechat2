import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Observable } from 'rxjs';
import { Doctor } from 'src/app/models/doctor.model';

@Component({
  selector: 'app-my-doctors',
  templateUrl: './my-doctors.component.html',
  styleUrls: ['./my-doctors.component.scss']
})
export class MyDoctorsComponent implements OnInit {
  user: User;
  doctors$: Observable<Doctor[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private core: CoreService,
    private doctorService: DoctorService,
  ) {
    this.route.data.subscribe(data => {
      this.user = data.user;
      this.doctors$ = this.doctorService.getDoctorsByUser(this.user._id);
    });
   }

  ngOnInit(): void {
    this.core.setTitle('我的药师团队');

  }

  addDoctor() {
    this.router.navigate(['/add-doctor'], {state: {user: this.user}});
  }

}
