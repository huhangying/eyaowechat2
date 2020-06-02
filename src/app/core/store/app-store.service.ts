import { Injectable } from '@angular/core';
import { AppState } from './app-state.model';
import { Store } from './store';
import * as store2 from 'store2';
import { Token } from 'src/app/models/token.model';
import { ApiToken } from 'src/app/models/api-token.model';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService extends Store<AppState> {

  constructor(
  ) {
    super(new AppState());
  }

  // selectors
  get token() { return this.state?.token || store2.get('token'); }
  get hid() { return this.state?.hid || store2.get('hid'); }
  get apiToken() { return this.state?.apiToken || store2.get('apiToken'); }

  updateToken(token: Token) {
    this.setState({
      ...this.state,
      token,
    });
    store2.set('token', token);
  }

  updateApiToken(apiToken: ApiToken) {
    this.setState({
      ...this.state,
      apiToken,
    });
    store2.set('apiToken', apiToken);
  }

  udpateHid(hid: string) {
    this.setState({
      ...this.state,
      hid,
    });
    store2.set('hid', hid);
  }

  reset() {
    this.setState(new AppState());
    // clear localstorage
    store2.clear();
  }
}
