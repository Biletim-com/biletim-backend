import { Injectable, NotFoundException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';

import { User } from '@app/modules/users/user.entity';
import { UsersService } from '@app/modules/users/users.service';
import { AuthConfigService } from '@app/configs/auth';

// types
import { AccessTokenPayload } from '../types/token-payload.type';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    authConfigService: AuthConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authentication?.accessToken,
      ]),
      secretOrKey: authConfigService.jwtSecret,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<User> {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    return user;
  }
}
