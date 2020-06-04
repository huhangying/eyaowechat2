import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private api: ApiService,
  ) { }

  getUserByOpenid(openid: string) {
    return this.api.get<User>('user/wechat/' + openid);
  }
}
