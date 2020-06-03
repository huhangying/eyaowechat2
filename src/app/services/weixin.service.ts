import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Token } from '../models/token.model';
import { map, tap } from 'rxjs/operators';
import { ApiToken } from '../models/api-token.model';
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

  // 
  getApiToken(openid: string) {
    return this.api.get<ApiToken>('wechat/login/' + openid);
  }

  get accessToken() { return this.accessToken; }

  /////////////////////////////////////////
  // 

  async fetchWechatSettings() {
    if (!this.appid || !this.secret) {
      const settings = await this.api.get<Const[]>('const/group/2').toPromise() // 2 is wechat group      
      this.appid = settings.find(_ => _.name === 'appId').value;
      this.secret = settings.find(_ => _.name === 'secret').value;
    }
  }
}
