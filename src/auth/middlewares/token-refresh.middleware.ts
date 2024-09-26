import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

import { UsersService } from '@app/modules/users/users.service';
import { PanelUsersService } from '@app/modules/panel-users/panel-users.service';
import { TokenService } from '../services/token.service';
import { CookieService } from '../services/cookie.service';
import { PanelUser } from '@app/modules/panel-users/panel-user.entity';
import { User } from '@app/modules/users/user.entity';

// types
import { Tokens } from '../types/tokens.type';

@Injectable()
export class TokenRefreshMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly panelUsersService: PanelUsersService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { accessToken, refreshToken }: Tokens =
      req.cookies.Authentication || {};

    if (!(accessToken && refreshToken)) {
      return next();
    }

    const decodedAccessToken: any = this.jwtService.decode(accessToken);
    if (decodedAccessToken.type !== 'access') {
      throw new UnauthorizedException('Invalid access token');
    }
    if (Date.now() >= decodedAccessToken.exp * 1000) {
      if (!refreshToken) {
        throw new UnauthorizedException(
          'Token expired and no refresh token provided',
        );
      }
      try {
        const decodedRefreshToken = this.jwtService.verify(refreshToken);
        console.log({ decodedAccessToken });
        if (Date.now() >= decodedRefreshToken.exp * 1000) {
          throw new UnauthorizedException('Refresh token expired');
        }
        if (decodedRefreshToken.type !== 'refresh') {
          throw new UnauthorizedException('Invalid refresh token');
        }

        let user: User | PanelUser;

        const userId = decodedRefreshToken.sub;
        const isPanelUser = await this.panelUsersService.isPanelUser(userId);
        if (isPanelUser) {
          user = await this.panelUsersService.findPanelUserById(userId);
        } else {
          user = await this.usersService.findOne(userId);
        }

        const tokens = this.tokenService.generateTokens(user);
        this.cookieService.setAuthCookie(tokens, res);
      } catch (error) {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }

    return next();
  }
}
