import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppStoreService } from 'src/app/core/store/app-store.service';
import weui from 'weui.js';
import { WeixinService } from 'src/app/services/weixin.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  constructor(
    private router: Router,
    private appStore: AppStoreService,
    private wxService: WeixinService,
  ) {
  }

  ngOnInit(): void {
  }

  nav(target: string) {
    this.router.navigate([target], {
      queryParams: {
        openid: this.appStore.token?.openid,
        state: this.appStore.hid
      }
    });
  }

  refreshToken() {
    if (!this.appStore?.token?.refresh_token) {
      return weui.alert('No refresh token existed.');
    }
    this.wxService.refreshToken(this.appStore.token.refresh_token).pipe(
      tap(token => {
        if (token) {
          weui.alert(JSON.stringify(token));
          this.appStore.updateToken(token);
        }
      })
    ).subscribe();
  }

  displayStore() {
    weui.alert(JSON.stringify(this.appStore.state));
  }

}
