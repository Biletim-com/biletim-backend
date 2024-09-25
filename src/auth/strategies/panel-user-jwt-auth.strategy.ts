import { Injectable, NotFoundException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';

import { PanelUser } from '@app/modules/panel-users/panel-user.entity';
import { PanelUsersService } from '@app/modules/panel-users/panel-users.service';
import { AuthConfigService } from '@app/configs/auth';

import { AccessTokenPayload } from '../types/token-payload.type';

@Injectable()
export class PanelUserJwtAuthStrategy extends PassportStrategy(
  Strategy,
  'panel-user-jwt-auth',
) {
  constructor(
    authConfigService: AuthConfigService,
    private readonly panelUsersService: PanelUsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authentication?.accessToken,
      ]),
      secretOrKey: authConfigService.jwtSecret,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<PanelUser> {
    const panelUser = await this.panelUsersService.findPanelUserById(
      payload.sub,
    );
    if (!panelUser) {
      throw new NotFoundException('Panel user is not found');
    }
    return panelUser;
  }
}
