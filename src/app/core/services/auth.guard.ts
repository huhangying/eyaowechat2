import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { AppStoreService } from '../store/app-store.service';
import { WeixinService } from 'src/app/services/weixin.service';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import weui from 'weui.js';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    // private router: Router,
    private wxService: WeixinService,
    private appStore: AppStoreService,
  ) {
    // this.getApiTokenByOpenid('oEMw9sx4qgx5ygtJuN2MoJ9jQ4eg').subscribe();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const openid = this.appStore?.token?.openid || next.queryParams?.openid;
    const hid = this.appStore?.hid || +next.queryParams.state || 1; // default value is for test
    const apiToken = this.appStore?.apiToken;

    if (openid && apiToken) { // skip if token/openid existed
      return true;
    }
  
    if (!openid) {
      const { code } = next.queryParams;
      if (!code) return true; //todo: revers to false. for test
      // auth to get openid (with code and state)

      return this.wxService.getToken(code, hid).pipe(
        switchMap(token => {
          if (token) {
            if (!apiToken) {
              return this.canGetApiTokenByOpenid(hid, openid);
            }
            this.appStore.updateToken(token);
            return of(true);
          }
          return of(false);
        }),
      );
    }
    else { // openid existed
      return this.canGetApiTokenByOpenid(hid, openid);
    }
  }

  canGetApiTokenByOpenid(hid: number, openid: string) {
    return this.wxService.getApiToken(hid, openid).pipe(
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
