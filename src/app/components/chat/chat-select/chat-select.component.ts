import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Doctor } from 'src/app/models/doctor.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { distinctUntilChanged, tap, takeUntil, map } from 'rxjs/operators';
import { AppStoreService } from 'src/app/core/store/app-store.service';

@Component({
  selector: 'app-chat-select',
  templateUrl: './chat-select.component.html',
  styleUrls: ['./chat-select.component.scss']
})
export class ChatSelectComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  doctors$: Observable<Doctor[]>;
  csDoctor: Doctor; // 客服药师

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private core: CoreService,
    private doctorService: DoctorService,
    private appStore: AppStoreService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        this.csDoctor = data.csDoctor;
        
        if (this.user) {
          this.doctors$ = this.doctorService.getDoctorsByUser(this.user._id).pipe(
            map(doctors => {
              // doctors = doctors || [];
              // 总是把客服药师放到首位
              if (this.csDoctor?._id && this.csDoctor?.isCustomerService) {
                doctors.unshift(this.csDoctor);
              }
              return doctors;
            })
          );
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('在线咨询');
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
