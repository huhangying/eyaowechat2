import { Component, OnInit, Input } from '@angular/core';
import { PageType } from 'src/app/core/enum/page.enum';
import { User } from 'src/app/models/user.model';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-doctors',
  templateUrl: './select-doctors.component.html',
  styleUrls: ['./select-doctors.component.scss']
})
export class SelectDoctorsComponent implements OnInit {
  @Input() pageType: PageType;
  @Input() set user(val: User) {
    if (val?._id) {
      this.doctors$ = this.doctorService.getDoctorsByUser(val._id);
    }
  };
  doctors$: Observable<Doctor[]>;

  constructor(
    private doctorService: DoctorService,
  ) {
  }

  ngOnInit(): void {
  }

}
