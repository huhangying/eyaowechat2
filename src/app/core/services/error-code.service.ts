import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorCodeService {

  constructor() { }

  getMessageByErrorCode(code: string) {
    switch(code) {
      case 'double_booking':
        return '不能重复预约。您已经成功预约该门诊！';
        
      case 'no_booking_available':
        return '没有可预约的门诊。请选择其它时间段的门诊。';

      default: 
      return '';
    }
  }
}
