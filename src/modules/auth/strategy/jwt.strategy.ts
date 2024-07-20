import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthStrategy, UserResponse } from '../auth.strategy';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements AuthStrategy
{
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      secretOrKey: process.env.JWT_SECRET,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    });
  }

  public validate(accessToken: string): Promise<UserResponse> {
    return Promise.resolve(jwt.decode(accessToken) as UserResponse);
  }
}
