import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppStoreService } from '../store/app-store.service';
import { WeixinService } from 'src/app/services/weixin.service';
import { map, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private wxService: WeixinService,
    private appStore: AppStoreService,
  ) {
  }

  // openid > code
  canActivate(
    next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // entry: code + state;
    // redirect: openid + state
    const { code, state, openid } = next.queryParams; // state is hid

    if (openid && this.appStore?.apiToken) { // skip if token/openid existed
      return true;
    }

    const hid = +state;
    if (!openid) {
      this.appStore.udpateHid(hid);
      return this.wxService.getToken(code, hid).pipe(
        concatMap(token => {
          if (token) {
            this.appStore.updateToken(token);
            return this.canGetApiTokenByOpenid(hid, token.openid);
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
