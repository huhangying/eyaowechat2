import { Injectable } from '@angular/core';
import weui from 'weui.js';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
  ) { }

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

  errorCatch(msg?: string) {
    this.error(msg);
    return EMPTY;
  }

}
