import { Injectable } from '@angular/core';
import { AppState } from './app-state.model';
import { Store } from './store';
import { Token } from 'src/app/models/token.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService extends Store<AppState> {

  constructor(
  ) {
    super(new AppState());
  }

  // selectors
  get token() { return this.state?.token; }
  get hid() { return this.state?.hid; }
  get apiToken() { return this.state?.apiToken; }
  get user() { return this.state?.user; }

  updateToken(token: Token) {
    this.setState({
      ...this.state,
      token,
    });
  }

  updateApiToken(apiToken: string) {
    this.setState({
      ...this.state,
      apiToken,
    });
  }

  updateUser(user: User) {
    this.setState({
      ...this.state,
      user,
    });
  }

  udpateHid(hid: string) {
    this.setState({
      ...this.state,
      hid,
    });
  }

  reset() {
    this.setState(new AppState());
  }
}
