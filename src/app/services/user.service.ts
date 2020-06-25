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

  updateById(id: string, user: User) {
    return this.api.patch('user/' + id, user);
  }

  isFirstVisit(departmentid: string) {
    if (!this.user?.visitedDepartments?.length) return true;
    return !this.user.visitedDepartments.find(_ => _ === departmentid);
  }

  get user() { return this.appStore.user; }
  get openid() { return this.appStore.token?.openid; }
}
