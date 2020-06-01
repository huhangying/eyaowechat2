import { Injectable } from '@angular/core';
import { AppState } from './app-state.model';
import { Store } from './store';
import * as store2 from 'store2';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService extends Store<AppState> {

  constructor(
  ) {
    super(new AppState());
  }

  // selectors
  get accessToken() { return this.state?.accessToken || store2.get('accessToken') || '33_TIPx0vmoALhYJ21L77M3aK-Png92cUluL9jt3VeXfoHVKWkL4DyZOWCCKNpwR7i1oD_FrGwJGGqg6U40d9J65Ol9r6BzU7W9UgrRz96JUlEt2SUfC3JdopXWFJ-4oLeRqEMya8z-_VO-r7MUVTYbACAIGL'; }

  updateAccessToken(accessToken: string) {
    this.setState({
      ...this.state,
      accessToken,
    });
    store2.set('accessToken', accessToken);
  }

  reset() {
    this.setState(new AppState());
    // clear localstorage
    store2.clear();
  }
}
