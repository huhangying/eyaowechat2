import { Token } from 'src/app/models/token.model';
import { ApiToken } from 'src/app/models/api-token.model';

export class AppState {
  constructor(
      public readonly token?: Token,
      public readonly hid?: string,
      public readonly apiToken?: ApiToken,
  ) { }
}
