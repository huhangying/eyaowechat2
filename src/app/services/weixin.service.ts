import { Injectable } from '@angular/core';
import { Token } from '../models/token.model';
import { map, tap } from 'rxjs/operators';
import { Signature } from '../models/signature.model';
import weui from 'weui.js';
import { ApiService } from '../core/services/api.service';
import { Const } from '../models/const.model';

@Injectable({
  providedIn: 'root'
})
export class WeixinService {
  appid: string;
  secret: string;
  access_token: string;

  constructor(
    private api: ApiService,
  ) {
    this.fetchWechatSettings();
  }

  getSignature(openid: string) {
    return this.api.get<Signature>('wechat/getSignature/' + openid).pipe(
      map(result => {
        if (result) {
          return {
            ...result,
            appid: this.appid
          }
        }
        return result;
      })
    );
  }

  // get token by code
  getToken(code: string) {
    return this.api.get<Token>('wechat/getWeixinToken', {
      appid: this.appid,
      secret: this.secret,
      code: code,
      grant_type: 'authorization_code'
    });
  }

  refreshToken(refreshCode: string) {
    return this.api.get<Token>('wechat/refreshWeixinToken', {
      appid: this.appid,
      grant_type: 'refresh_token',
      refresh_token: refreshCode,
    });
  }

  // 
  getApiToken(openid: string) {
    return this.api.get<string>('wechat/login/' + openid);
  }

  get accessToken() { return this.accessToken; }

  /////////////////////////////////////////
  // 

  async fetchWechatSettings() {
    if (!this.appid || !this.secret) {
      const settings = await this.api.get<Const[]>('const/group/2').toPromise() // 2 is wechat group      
      this.appid = settings.find(_ => _.name === 'appid').value;
      this.secret = settings.find(_ => _.name === 'secret').value;
    }
  }
}
