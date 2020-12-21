import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStoreService } from '../store/app-store.service';
import { WeixinService } from 'src/app/services/weixin.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthMockGuard implements CanActivate {

  constructor(
    private wxService: WeixinService,
    private appStore: AppStoreService,
  ) {
  }

  // openid > code
  canActivate(
    next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // mock appStore: token, hid and apiToken
    if (environment.production) {
      this.appStore.updateToken({
        openid: 'oCVHLwIa5VtXx1eBHBQ2VsAtf5rA',
        expires_in: 7200,
        access_token: 'access_token',
        scope: 'SCOPE',
        refresh_token: 'refresh_token'
      });
      this.appStore.udpateHid(1);
    } else {
      this.appStore.updateToken({
        // openid: 'oEMw9s_QeV2wdIxf2G7R59Kwu09s', // maggie
        openid: 'oEMw9sx4qgx5ygtJuN2MoJ9jQ4eg', // harry
        expires_in: 7200,
        access_token: 'access_token',
        scope: 'SCOPE',
        refresh_token: 'refresh_token'
      });
      this.appStore.udpateHid(2);
    }    

    return this.canGetApiTokenByOpenid(this.appStore.hid, this.appStore.token.openid);
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
