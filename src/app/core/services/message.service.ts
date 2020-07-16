import { Injectable } from '@angular/core';
import weui from 'weui.js';
import { EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorCodeService } from './error-code.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private snackBar: MatSnackBar,
    private errorCode: ErrorCodeService,
  ) {
  }

  alert(msg: string) {
    weui.alert(msg);
  }

  confirm(msg: string, callback) {
    weui.confirm(msg, callback);
  }

  deleteConfirm(callback) {
    weui.confirm('您确定要删除？', callback);
  }

  success(msg?: string, timer?: number) {
    weui.toast(msg || '操作成功', timer || 2500);
  }

  error(msg?: string) {
    weui.topTips(msg || '操作失败', 3000);
  }

  errorCatch(code?: string) {
    this.error(this.errorCode.getMessageByErrorCode(code));
    return EMPTY;
  }

  toast(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }

}
