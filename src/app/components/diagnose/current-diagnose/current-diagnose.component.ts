import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DiagnoseDetailsComponent } from '../diagnose-details/diagnose-details.component';
import { Diagnose } from 'src/app/models/diagnose.model';
import { DiagnoseService } from 'src/app/services/diagnose.service';
import { TodayNoticeComponent } from '../today-notice/today-notice.component';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { AppStoreService } from 'src/app/core/store/app-store.service';

@Component({
  selector: 'app-current-diagnose',
  templateUrl: './current-diagnose.component.html',
  styleUrls: ['./current-diagnose.component.scss']
})
export class CurrentDiagnoseComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  doctor: Doctor;
  diagnose: Diagnose;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private core: CoreService,
    public dialog: MatDialog,
    private diagnoseService: DiagnoseService,
    private doctorService: DoctorService,
    private appStore: AppStoreService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        if (this.user?._id) {
          this.diagnoseService.getUserCurrentDiagnose(this.user._id).subscribe(
            result => {
              this.diagnose = result;
            }
          );
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('当前门诊');
    if (this.appStore.token?.openid) {
      this.core.replaceUrlWithOpenid(this.route.routeConfig.path, this.appStore.token.openid, this.appStore.hid);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  nav(target: string) {
    this.doctorService.doctor = this.diagnose.doctor;
    this.router.navigate([target], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        doctorid: this.diagnose.doctor._id
      },
    });
  }

  openDiagnoseDetails(mode: number) {
    if (this.diagnose) {
      this.dialog.open(DiagnoseDetailsComponent, {
        maxWidth: '100vw',
        panelClass: 'full-width-dialog',
        data: {
          diagnose: this.diagnose,
          mode: mode
        }
      }).afterClosed()
        .subscribe(() => {
          this.core.setTitle('当前门诊');
        });
    }
  }

  openTodayNotice() {
    if (this.diagnose) {
      this.dialog.open(TodayNoticeComponent, {
        maxWidth: '100vw',
        panelClass: 'full-width-dialog',
        data: {
          diagnose: this.diagnose,
        }
      }).afterClosed()
        .subscribe(() => {
          this.core.setTitle('当前门诊');
        });
    }
  }

}
