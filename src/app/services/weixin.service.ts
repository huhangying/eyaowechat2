import { Injectable } from '@angular/core';
import { Token } from '../models/token.model';
import { map, tap, switchMap, take } from 'rxjs/operators';
import { Signature } from '../models/signature.model';
import { ApiService } from '../core/services/api.service';
import { Const } from '../models/const.model';
import { WechatSecret } from '../models/wechat-secret.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeixinService {
  secret: WechatSecret;
  access_token: string;

  constructor(
    private api: ApiService,
  ) {
  }

  getSignature(openid: string) {
    return this.api.get<Signature>('wechat/authSignature/' + openid).pipe(
      map(result => {
        if (result) {
          return {
            ...result,
            appid: this.secret.appid
          }
        }
        return result;
      })
    );
  }

  getSignatureByUrl(url: string) {
    return this.api.get<Signature>('wechat/auth-signature/' + encodeURIComponent(url)).pipe(
      map(result => {
        if (result) {
          return {
            ...result,
            appid: this.secret.appid
          }
        }
        return result;
      })
    );
  }

  // get token by code
  getToken(code: string, hid: number) {
    if (this.secret?.appid && this.secret?.secret) { // has secret in service
      return this.api.get<Token>('wechat/authWeixinToken', {
        appid: this.secret.appid,
        secret: this.secret.secret,
        code: code,
        grant_type: 'authorization_code'
      });
    }
    return this.fetchWechatSettings(hid).pipe(
      switchMap(secret => {
        this.secret = secret;
        return this.api.get<Token>('wechat/authWeixinToken', {
          appid: secret.appid,
          secret: secret.secret,
          code: code,
          grant_type: 'authorization_code'
        });
      })
    );
  }

  refreshToken(refreshCode: string) {
    return this.api.get<Token>('wechat/authRefreshWeixinToken', {
      appid: this.secret.appid,
      grant_type: 'refresh_token',
      refresh_token: refreshCode,
    });
  }

  // 
  getApiToken(hid: number, openid: string) {
    return this.api.get<string>(`wechat/login/${hid}/${openid}`);
  }

  get accessToken() { return this.accessToken; }

  fetchWechatSettings(hid: number) {
    return (this.secret?.appid) ?
      of(this.secret) :
      this.api.get<WechatSecret>('hospital/wechat/auth/' + hid);
  }

  //////////////////////////////////////
  triggerResendMsg(openid: string) {
    this.api.get('wechat/resend-msg/' + openid).subscribe();
  }

  sendUserMsg(openid: string, title: string, description: string, url: string, picUrl: string) {
    return this.api.post('wechat/send-client-msg/' + openid, {
      article: {
        title: title,
        description: description,
        url: url,
        picurl: picUrl
      }
    });
  }
}
