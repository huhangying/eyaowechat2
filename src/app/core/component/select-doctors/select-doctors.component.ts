import { Component, OnInit, Input } from '@angular/core';
import { PageType } from 'src/app/core/enum/page.enum';
import { Doctor } from 'src/app/models/doctor.model';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { AppStoreService } from '../../store/app-store.service';
import { tap } from 'rxjs/operators';
import { ConsultServicePrice } from '../../../models/consult/doctor-consult.model';

@Component({
  selector: 'app-select-doctors',
  templateUrl: './select-doctors.component.html',
  styleUrls: ['./select-doctors.component.scss']
})
export class SelectDoctorsComponent implements OnInit {
  @Input() pageType: PageType;
  @Input() user: User;
  @Input() doctors: Observable<Doctor[]>;
  @Input() myDoctors?: Doctor[]; // used only for pageType >= 4
  openid: string;
  state: string;


  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private appStore: AppStoreService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.pipe(
      tap(result => {
        this.openid = result.openid;
        this.state = result.state;
      })
    ).subscribe();
  }

  ngOnInit(): void {
  }

  goDetails(doctor: Doctor) {
    this.doctorService.doctor = doctor;
    let redirectTarget = '/doctor-details';
    if (this.pageType === PageType.chat && !doctor.prices?.length) {
      redirectTarget = '/chat';
    } else 
    if (this.pageType === PageType.book) {
      redirectTarget = '/book';
    }
    this.router.navigate([redirectTarget], this.buildQueryParams(doctor._id));
  }

  private buildQueryParams(doctorid: string) {
    return {
      queryParams: {
        doctorid: doctorid,
        openid: this.appStore.token?.openid || this.openid,
        state: this.appStore.hid || this.state,
      }
    }
  }

  // return true if doctor has been focused
  checkDoctorFocus(doctorId: string) {
    return this.myDoctors?.findIndex(_ => _._id === doctorId) > -1;
  }
}
