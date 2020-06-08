import { Injectable } from '@angular/core';
import weui from 'weui.js';

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

  success() {
    weui.toast('操作成功', 3000);
  }

  error(msg: string) {
    weui.topTips(msg, 3000);
  }

}
