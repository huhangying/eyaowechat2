import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { Diagnose } from 'src/app/models/diagnose.model';
import { User } from 'src/app/models/user.model';
import { DiagnoseService } from 'src/app/services/diagnose.service';
import { TodayNoticeComponent } from '../today-notice/today-notice.component';
import wx from 'weixin-js-sdk';
import { MedicineNotice } from 'src/app/models/medicine/medicine-notice.model';
import { Dosage, Medicine } from 'src/app/models/medicine/medicine.model';
import { MedicineService } from 'src/app/services/medicine.service';

@Component({
  selector: 'app-today-reminder',
  templateUrl: './today-reminder.component.html',
  styleUrls: ['./today-reminder.component.scss']
})
export class TodayReminderComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  diagnose: Diagnose;
  currentPrescription: Medicine[];
  currentNotices: MedicineNotice[];

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private diagnoseService: DiagnoseService,
    public dialog: MatDialog,
    private medicineService: MedicineService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        if (this.user?._id) {
          this.diagnoseService.getUserCurrentDiagnose(this.user._id).subscribe(
            result => {
              this.diagnose = result;

              if (this.diagnose) {
                this.currentPrescription = this.diagnose?.prescription?.filter(_ => {
                  return this.core.isInToday(_.startDate, _.endDate);
                });
                this.currentNotices = this.diagnose?.notices?.filter(_ => {
                  return this.core.isInToday(_.startDate, _.endDate, _.days_to_start, _.during);
                });
              }
            }
          );
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('今日用药提醒');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  showDosageInstruction(dosage: Dosage, unit: string) {
    return this.medicineService.showDosageInstruction(dosage, unit);
  }
  
  close() {
    wx.closeWindow();
  }

}
