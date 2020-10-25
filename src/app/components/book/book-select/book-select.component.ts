import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Doctor } from 'src/app/models/doctor.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { AppStoreService } from 'src/app/core/store/app-store.service';

@Component({
  selector: 'app-book-select',
  templateUrl: './book-select.component.html',
  styleUrls: ['./book-select.component.scss'],
})
export class BookSelectComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  doctors$: Observable<Doctor[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private core: CoreService,
    private doctorService: DoctorService,
    public appStore: AppStoreService,
  ) { 
    this.user = this.appStore.user;
    // this.route.data.pipe(
    //   distinctUntilChanged(),
    //   tap(data => {
    //     this.user = data.user;
        if (this.user) {
          this.doctors$ = this.doctorService.getScheduleDoctorsByUser(this.user._id);
        }
    //   }),
    //   takeUntil(this.destroy$)
    // ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('预约门诊');
    if (this.appStore.token?.openid) {
      this.core.replaceUrlWithOpenid(this.route.routeConfig.path, this.appStore.token.openid, this.appStore.hid);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  // viewMyDoctors() {
  //   this.router.navigate(['/my-doctors'], {
  //     queryParams: {
  //       openid: this.appStore.token?.openid || this.route.snapshot.queryParams?.openid,
  //       state: this.appStore.hid || this.route.snapshot.queryParams?.state
  //     }
  //   });
  // }

  addDoctor() {
    this.router.navigate(['/add-doctor'], {
      queryParams: {
        openid: this.appStore.token?.openid || this.route.snapshot.queryParams?.openid,
        state: this.appStore.hid || this.route.snapshot.queryParams?.state
      }
    });
  }
}
