import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Token } from '../models/token.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeixinService {
  access_token: string;

  constructor(
    private http: HttpClient,
  ) {
    // this.getAccessToken();
  }

  checkSign() {
    // this.api.
  }

  authorize(redirectUrl: string, ) {
    return this.http.get<Token>(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${environment.appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base&state=101#wechat_redirect`).pipe(
      tap((result) => {
        console.log(result);        
      }),
      // map((result) => result.body?.access_token)
    );
  }

  getToken() {
    return this.http.get<Token>(environment.weixinUrl + 'token', {
      params: {
        appid: environment.appid,
        secret: environment.secret,
        grant_type: 'client_credential'
      },
      // observe: 'response'
    }).pipe(
      // map((result) => result?.access_token)
      // map((result) => result.body?.access_token)
    );
  }

  get accessToken() { return this.accessToken; }

  createMenu(data) {
    return this.http.post(environment.weixinUrl + 'menu/create?access_token=' + this.accessToken, data);
  }
}
