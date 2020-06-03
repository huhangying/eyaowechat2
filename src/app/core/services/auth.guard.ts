import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
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
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const openId = this.appStore.token?.openid;
    const hid = this.appStore.apiToken?.hid;
    if (openId && hid) { // skip if token/openid existed
      return true;
    }

    if (!openId) {
      // auth to get openid (with code and state)
      const { code } = next.queryParams;
      if (!code) return true; //todo: revers to false. for test
     
      return this.wxService.getToken(code).pipe(
        map(token => {
          if (token) {
            this.appStore.updateToken(token);
            if (!hid) {
              this.getApiTokenByOpenid(openId);
            }
            return true;
          }
          return false;
        }),
        catchError(err => {
          weui.alert(JSON.stringify(err));
          throw(err);
        })
      );
      return true;
    }
    else {
      return this.getApiTokenByOpenid(openId);
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
