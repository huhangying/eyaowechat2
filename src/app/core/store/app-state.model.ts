import { Token } from 'src/app/models/token.model';
import { User } from 'src/app/models/user.model';
import { Doctor } from 'src/app/models/doctor.model';

export class AppState {
  constructor(
      public readonly token?: Token,
      public readonly hid?: number,
      public readonly apiToken?: string,
      public readonly user?: User,
      public readonly doctor?: Doctor,
  ) { 
  }
}
