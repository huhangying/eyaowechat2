import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { AppStoreService } from '../core/store/app-store.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private api: ApiService,
    private appStore: AppStoreService,
  ) { }

  getUserByOpenid(openid: string) {
    return this.api.get<User>('user/wechat/' + openid).pipe(
      tap(user => {
        if (user) {
          this.appStore.updateUser(user);
        }
      })
    );
  }

  get user() { return this.appStore.user; }
}
