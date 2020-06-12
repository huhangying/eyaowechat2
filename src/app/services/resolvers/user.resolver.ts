import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from '../user.service';
import { of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UserResolver implements Resolve<User> {
    constructor(
        private userService: UserService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.userService.user ?
            of(this.userService.user) :
            this.userService.getUserByOpenid(this.userService.openid || route.queryParams.openid);
    }
}
