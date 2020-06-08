import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Const } from '../models/const.model';
import { map, filter, tap } from 'rxjs/operators';
import { Dosage } from '../models/medicine/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  medicine_periods: { name: string; value: number }[];

  constructor(
    private api: ApiService,
  ) {
  }

  get medicinePeriods() {
    return this.medicine_periods;
  }

  showDosageInstruction(dosage: Dosage, unit: string): string {
    if (!this.medicinePeriods?.length) return '';
    const selectedIntervalDay = (dosage.intervalDay > -1 && this.medicinePeriods) ?
      this.medicinePeriods.find(item => item.value === dosage.intervalDay) : null;
    return `${dosage.way}, ${selectedIntervalDay ? selectedIntervalDay.name : '空'} ${dosage.frequency || 0}次, 每次${dosage.count}${unit}`;
  }

  getMedicinePeriods() {
    return this.api.get<Const[]>('consts/group/1').pipe(
      map(data => {
        const medicine_periods = data.find(_ => _.name === 'medicine_periods')?.value;

        return medicine_periods.split('|').map(value => {
          const items = value.split(':');
          return { name: items[0], value: +items[1] };
        })
      }),
      tap(resutls => {
        this.medicine_periods = resutls
      })
    );
  }

}
