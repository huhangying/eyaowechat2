import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Token } from '../models/token.model';
import { tap, map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class WeixinService {
  access_token: string;

  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) {
    // this.getAccessToken();
  }

  checkSign() {
    // this.api.
  }

  getAccessToken() {
    return this.http.get<Token>(environment.weixinUrl + 'token', {
      params: {
        appid: environment.appid,
        secret: environment.secret,
        grant_type: 'client_credential'
      },
      // observe: 'response'
    }).pipe(
      map((result) => result?.access_token)
      // map((result) => result.body?.access_token)
    );
  }

  get accessToken() { return this.accessToken; }

  createMenu(data) {
    return this.http.post(environment.weixinUrl + 'menu/create?access_token=' + this.accessToken, data);
  }
}
