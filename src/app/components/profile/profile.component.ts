import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { AppStoreService } from 'src/app/core/store/app-store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public core: CoreService,
    private appStore: AppStoreService,
    private userService: UserService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('个人中心');
    if (this.appStore.token?.openid) {
      this.core.replaceUrlWithOpenid(this.route.routeConfig.path, this.appStore.token.openid, this.appStore.hid);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  nav(target: string) {
    this.router.navigate([target], {
      queryParams: {
        openid: this.appStore.token?.openid || this.route.snapshot.queryParams.openid,
        state: this.appStore.hid || this.route.snapshot.queryParams.state
      }
    });
  }

}
