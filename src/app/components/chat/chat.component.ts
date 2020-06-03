import { Component, OnInit } from '@angular/core';
// import 'weui';
import WechatJSSDK from 'wechat-jssdk/dist/client.umd';
import weui from 'weui.js';
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
  wechat;
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
          this.wechat = new WechatJSSDK({
            ...result,
            debug: 'true',
            jsApiList: [],
            customUrl: ''
          });

          this.wechat.initialize()
            .then(w => {
              //set up your share info, "w" is the same instance as "wechatObj"
              weui.alert(JSON.stringify(w));
            })
            .catch(err => {
              console.error(err);
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
