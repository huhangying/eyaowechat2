import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { AppStoreService } from '../store/app-store.service';
import { WeixinService } from 'src/app/services/weixin.service';
import { tap, map, catchError } from 'rxjs/operators';
import weui from 'weui.js';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    // private router: Router,
    private wxService: WeixinService,
    private appStore: AppStoreService
  ) {
    this.getApiTokenByOpenid('oEMw9sx4qgx5ygtJuN2MoJ9jQ4eg').subscribe();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const openid = this.appStore.token?.openid;
    const apiToken = this.appStore.apiToken;
    if (openid && apiToken) { // skip if token/openid existed
      return true;
    }

    if (!openid) {
      // auth to get openid (with code and state)
      const { code } = next.queryParams;
      if (!code) return true; //todo: revers to false. for test

      return this.wxService.getToken(code).pipe(
        map(token => {
          if (token) {
            this.appStore.updateToken(token);
            if (!apiToken) {
              this.getApiTokenByOpenid(openid);
            }
            return true;
          }
          return false;
        }),
        catchError(err => {
          weui.alert(JSON.stringify(err));
          return EMPTY;
        })
      );
      return true;
    }
    else {
      return this.getApiTokenByOpenid(openid);
    }
  }

  getApiTokenByOpenid(openid: string) {
    return this.wxService.getApiToken(openid).pipe(
      map(apiToken => {
        if (!apiToken) {
          return false;
        }
        this.appStore.updateApiToken(apiToken);
        return true;
      })
    );
  }

}
