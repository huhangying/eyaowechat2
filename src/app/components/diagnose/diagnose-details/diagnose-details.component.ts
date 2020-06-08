import { Component, OnInit } from '@angular/core';
import { Diagnose } from 'src/app/models/diagnose.model';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { Dosage } from 'src/app/models/medicine/medicine.model';

@Component({
  selector: 'app-diagnose-details',
  templateUrl: './diagnose-details.component.html',
  styleUrls: ['./diagnose-details.component.scss']
})
export class DiagnoseDetailsComponent implements OnInit {
  diagnose: Diagnose;

  constructor(
    private router: Router,
    private core: CoreService,
    private medicineService: MedicineService,
  ) { 
    this.diagnose = this.router.getCurrentNavigation().extras.state?.diagnose || {};
  }

  ngOnInit(): void {
    this.core.setTitle('门诊记录详细情况');
  }

  showDosageInstruction(dosage: Dosage, unit: string) {
    return this.medicineService.showDosageInstruction(dosage, unit);
  }

  getSurveyList() {
    return  this.diagnose.surveys.find(_ => _.type === 5)?.list;
  }

}
