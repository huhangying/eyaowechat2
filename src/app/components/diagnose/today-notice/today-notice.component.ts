import { Component, OnInit, Inject, Optional, SkipSelf } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MedicineNotice } from 'src/app/models/medicine/medicine-notice.model';
import { CoreService } from 'src/app/core/services/core.service';
import { Diagnose } from 'src/app/models/diagnose.model';
import { Dosage, Medicine } from 'src/app/models/medicine/medicine.model';
import { MedicineService } from 'src/app/services/medicine.service';

@Component({
  selector: 'app-today-notice',
  templateUrl: './today-notice.component.html',
  styleUrls: ['./today-notice.component.scss']
})
export class TodayNoticeComponent implements OnInit {
  diagnose: Diagnose;
  currentPrescription: Medicine[];
  currentNotices: MedicineNotice[];

  constructor(
    private core: CoreService,
    private medicineService: MedicineService,
    public dialogRef: MatDialogRef<TodayNoticeComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: {
      diagnose: Diagnose;
      noticeOnly?: boolean;
    }
  ) {}

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    if (!this.data.noticeOnly) {
      this.core.setTitle('当日用药提醒');
    } else {
      this.core.setTitle('门诊提醒');
    }

    if (!this.data?.noticeOnly) {
      this.currentPrescription = this.data.diagnose?.prescription?.filter(_ => {
        return this.core.isInToday(_.startDate, _.endDate);
      });
      this.currentNotices = this.data.diagnose?.notices?.filter(_ => {
        return this.core.isInToday(_.startDate, _.endDate, _.days_to_start, _.during);
      });
    } else {
      // 显示所有的门诊提醒
      this.currentNotices = this.data.diagnose?.notices;
    }
  }

  close() {
    this.dialogRef.close();
  }

  showDosageInstruction(dosage: Dosage, unit: string) {
    return this.medicineService.showDosageInstruction(dosage, unit);
  }

}
