import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppStoreService } from '../store/app-store.service';
import { WeixinService } from 'src/app/services/weixin.service';
import { map, concatMap, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private wxService: WeixinService,
    private appStore: AppStoreService,
    private userService: UserService,
    private message: MessageService,
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
    this.appStore.udpateHid(hid);
    if (!openid) {
      return this.wxService.getToken(code, hid).pipe(
        tap(_token => {
          if (_token) {
            this.appStore.updateToken(_token);
          }
        }),
        concatMap(token => this.canGetApiTokenByOpenid(hid, token.openid))
      );
    }
    else { // openid existed
      return this.canGetApiTokenByOpenid(hid, openid);
    }
  }

  canGetApiTokenByOpenid(hid: number, openid: string) {
    return this.wxService.getApiToken(hid, openid).pipe(
      tap(apiToken => {
        this.appStore.updateApiToken(apiToken);
      }),
      concatMap( apiToken => {
        if (!apiToken) return of(false);
        return this.userService.getUserByOpenid(openid).pipe(
          tap(user => {
            
            if (user?.msgInQueue > 0) {
              let today = new Date();
              today.setHours(0, 0, 0);
              if (user.updated < today) { // 在今天之前更新过！
                // trigger resending msgs
                this.wxService.triggerResendMsg(openid);
              }
            }
            this.appStore.updateUser(user);
          }),
          map(user => !!user)
        )
      })
    );
  }
}
