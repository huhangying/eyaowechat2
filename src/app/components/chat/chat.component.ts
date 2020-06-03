import { Component, OnInit } from '@angular/core';
import weui from 'weui.js';
import wx from 'weixin-js-sdk';
import { AppStoreService } from '../../core/store/app-store.service';
import { ApiService } from 'src/app/core/services/api.service';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { WeixinService } from 'src/app/services/weixin.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  errorMessage: string;
  returnMessage: string;

  constructor(
    private appStore: AppStoreService,
    private api: ApiService,
    private wxService: WeixinService,

  ) {
    if (this.appStore.token?.openid) {
      this.buildWechatObj();
    } else {
      // for test
      this.wxService.getApiToken('oEMw9sx4qgx5ygtJuN2MoJ9jQ4eg').pipe(
        tap(apiToken => {
          this.appStore.updateApiToken(apiToken);
        })
      );
    }
  }

  ngOnInit(): void {
  }

  test() {
    weui.alert(JSON.stringify(this.appStore.token));
  }

  buildWechatObj() {
    this.wxService.getSignature(this.appStore.token.openid).pipe(
      tap(result => {
        if (result) {
          this.returnMessage = JSON.stringify(result);

          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appid: result.appid, // 必填，公众号的唯一标识
            timestamp: result.timestamp, // 必填，生成签名的时间戳
            nonceStr: result.nonce, // 必填，生成签名的随机串
            signature: result.signature,// 必填，签名
            jsApiList: ['checkJsApi'] // 必填，需要使用的JS接口列表
          });
          wx.ready((w) => {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            weui.alert('Ready:' + JSON.stringify(w));
          });
          wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            weui.alert('Error:' + JSON.stringify(res));
          });
        }
      }),
      catchError(err => {
        this.errorMessage = JSON.stringify(err);
        return EMPTY;
      })
    ).subscribe();
  }

}
