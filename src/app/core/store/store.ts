import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export class Store<T> {
  state$: Observable<T>;
  private _state$: BehaviorSubject<T>;

  protected constructor(initialState: T) {
    this._state$ = new BehaviorSubject(initialState);
    this.state$ = this._state$.asObservable();
  }
  get state(): T {
    return JSON.parse(JSON.stringify(this._state$.getValue() || {}));
  }

  // given top-level state key as a stream (will always emit the current
  // key value as the first item in the stream).
  select<K extends keyof T>(key: K): Observable<T[K]> {
    return this._state$.pipe(
      map((state: T) => {
        return (state[key]);
      }),
      distinctUntilChanged()
    );
  }

  setState(nextState: T) {
    this._state$.next(nextState);
  }
}
