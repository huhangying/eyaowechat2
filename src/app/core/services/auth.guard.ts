import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStoreService } from '../store/app-store.service';
import { WeixinService } from 'src/app/services/weixin.service';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    // private router: Router,
    private wx: WeixinService,
    private appStore: AppStoreService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.wx.authorize(encodeURI(window.location.href)).pipe(
      tap(result => {
        console.log(result);
        return true;        
      })

    ).subscribe();
    console.log(state);
    console.log(next);
    console.log( encodeURI(window.location.href));
    //encodeURI
    return true;
    
    // if (this.appStore.token) {
    //   return true;
    // }
    // return this.weixin.getToken().pipe(
    //   map(token => {
    //     if (token) {
    //       this.appStore.updateToken(token);
    //       return true;
    //     }
    //     return false;
    //   })
    // );
  }
  
}
