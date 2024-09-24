import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@app/modules/users/user.entity';
import { AuthConfigService } from '@app/configs/auth';
import { PanelUser } from '@app/modules/panel-users/panel-user.entity';

import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../types/token-payload.type';
import { Tokens } from '../types/tokens.type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authConfigService: AuthConfigService,
  ) {}

  generateTokens(user: User | PanelUser): Tokens {
    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      familyName: user.familyName,
      type: 'access',
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: user.id,
      type: 'refresh',
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.authConfigService.jwtExpiration,
    });
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}
