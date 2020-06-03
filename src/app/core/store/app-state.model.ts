import { Token } from 'src/app/models/token.model';

export class AppState {
  constructor(
      public readonly token?: Token,
      public readonly hid?: string, // actually no use
      public readonly apiToken?: string,
  ) { }
}
