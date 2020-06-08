import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { of } from 'rxjs';
import { MedicineService } from '../medicine.service';


@Injectable({
  providedIn: 'root'
})
export class MedicinePeriodsResolver implements Resolve<{ name: string; value: number }[]> {
  constructor(
    private medicineService: MedicineService,
  ) { }

  resolve() {
    return this.medicineService.medicinePeriods ?
      of(this.medicineService.medicinePeriods) :
      this.medicineService.getMedicinePeriods();
  }
}
