import { Component, OnInit, Input } from '@angular/core';
import { PageType } from 'src/app/core/enum/page.enum';
import { Doctor } from 'src/app/models/doctor.model';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { AppStoreService } from '../../store/app-store.service';
import { ThrowStmt } from '@angular/compiler';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-select-doctors',
  templateUrl: './select-doctors.component.html',
  styleUrls: ['./select-doctors.component.scss']
})
export class SelectDoctorsComponent implements OnInit {
  @Input() pageType: PageType;
  @Input() user: User;
  @Input() doctors: Observable<Doctor[]>;
  openid: string;
  state: string;

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private appStore: AppStoreService,
    private route: ActivatedRoute,
    // private route: ActivatedRouteSnapshot,
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

  goDoctorDetails(doctor: Doctor) {
    this.doctorService.doctor = doctor;
    this.router.navigate(['/doctor-details'], this.buildQueryParams(doctor._id));
  }

  goChat(doctor: Doctor) {
    this.doctorService.doctor = doctor;
    this.router.navigate(['/chat'], this.buildQueryParams(doctor._id));
  }

  goBook(doctor: Doctor) {
    this.doctorService.doctor = doctor;
    this.router.navigate(['/book'], this.buildQueryParams(doctor._id));
  }

  private buildQueryParams(doctorid: string) {
    return {
      queryParams: {
        doctorid: doctorid,
        openid: this.appStore.token?.openid || this.openid,
        state: this.appStore.hid || this.state
      }
    }
  }
}
