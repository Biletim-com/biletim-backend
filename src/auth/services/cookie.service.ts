import { Injectable } from '@nestjs/common';

import { AuthConfigService } from '@app/configs/auth';
import { Tokens } from '../types/tokens.type';
import type { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly authConfigService: AuthConfigService) {}

  private getCookieExpirationTime(): Date {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.authConfigService.jwtExpiration,
    );
    return expires;
  }

  public setAuthCookie(tokens: Tokens, response: Response): void {
    const expires = this.getCookieExpirationTime();
    response.cookie('Authentication', tokens, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires,
    });
  }

  public removeAuthCookie(response: Response): void {
    response.clearCookie('Authentication', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
}
