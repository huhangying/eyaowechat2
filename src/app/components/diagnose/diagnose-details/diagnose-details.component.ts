import { Component, OnInit, Inject, Optional, SkipSelf } from '@angular/core';
import { Diagnose } from 'src/app/models/diagnose.model';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { Dosage } from 'src/app/models/medicine/medicine.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-diagnose-details',
  templateUrl: './diagnose-details.component.html',
  styleUrls: ['./diagnose-details.component.scss']
})
export class DiagnoseDetailsComponent implements OnInit {
  diagnose: Diagnose;

  constructor(
    private core: CoreService,
    private medicineService: MedicineService,
    public dialogRef: MatDialogRef<DiagnoseDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: { 
      diagnose: Diagnose 
    },
   ) { 
    this.diagnose = data.diagnose;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.core.setTitle('门诊记录详细情况');
  }

  close() {
    this.dialogRef.close();
  }

  showDosageInstruction(dosage: Dosage, unit: string) {
    return this.medicineService.showDosageInstruction(dosage, unit);
  }

  getSurveyList() {
    return  this.diagnose.surveys.find(_ => _.type === 5)?.list;
  }

}
