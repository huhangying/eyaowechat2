import { Injectable } from '@angular/core';
import { AppState } from './app-state.model';
import { Store } from './store';
import * as store2 from 'store2';
import { Token } from 'src/app/models/token.model';

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

  updateToken(token: Token) {
    this.setState({
      ...this.state,
      token,
    });
    store2.set('token', token);
  }

  reset() {
    this.setState(new AppState());
    // clear localstorage
    store2.clear();
  }
}
