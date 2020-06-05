import { Token } from 'src/app/models/token.model';
import { User } from 'src/app/models/user.model';

export class AppState {
  constructor(
      public readonly token?: Token,
      public readonly hid?: number, // actually no use
      public readonly apiToken?: string,
      public readonly user?: User,
  ) { 
  }
}
