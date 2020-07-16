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

      default: 
      return '';
    }
  }
}
