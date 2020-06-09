import { Component, OnInit, Inject, Optional, SkipSelf } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MedicineNotice } from 'src/app/models/medicine/medicine-notice.model';
import { CoreService } from 'src/app/core/services/core.service';
import { Diagnose } from 'src/app/models/diagnose.model';
import { Dosage } from 'src/app/models/medicine/medicine.model';
import { MedicineService } from 'src/app/services/medicine.service';

@Component({
  selector: 'app-today-notice',
  templateUrl: './today-notice.component.html',
  styleUrls: ['./today-notice.component.scss']
})
export class TodayNoticeComponent implements OnInit {
  diagnose: Diagnose;

  constructor(
    private core: CoreService,
    private medicineService: MedicineService,
    public dialogRef: MatDialogRef<TodayNoticeComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: {
      diagnose: Diagnose
    }
  ) {
    this.diagnose = data.diagnose;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.core.setTitle('当日用药提醒');
  }

  close() {
    this.dialogRef.close();
  }

  showDosageInstruction(dosage: Dosage, unit: string) {
    return this.medicineService.showDosageInstruction(dosage, unit);
  }

}
