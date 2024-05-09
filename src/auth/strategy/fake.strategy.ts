import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { AuthStrategy, UserResponse } from '../auth.strategy';

@Injectable()
export class FakeAuthStrategy implements AuthStrategy {
  public validate(accessToken: string): Promise<UserResponse> {
    return Promise.resolve(jwt.decode(accessToken) as UserResponse);
  }
}
