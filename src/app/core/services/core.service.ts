import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(
    private titleService: Title,
  ) { }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public getTitle() {
    return this.titleService.getTitle();
  }

  isInToday(startDate: Date, endDate: Date, start = 0, during?: number): boolean {
    const today_date = moment();
    const start_date = moment(startDate).add(start, 'd');
    if (today_date.isBefore(start_date)) {
      return false;
    }
    let end_date = moment(endDate);
    if (during && start_date.add(during, 'd').isBefore(end_date)) {
      end_date = start_date.add(during, 'd');
    }
    if (today_date.isAfter(end_date)) {
      return false;
    }
    return true;
  }

  getMinutes(date: Date): number {
    return moment(date).minute();
  }

}
