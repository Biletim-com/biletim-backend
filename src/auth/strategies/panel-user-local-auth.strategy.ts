import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { PasswordService } from '../services/password.service';
import { PanelUsersService } from '@app/modules/panel-users/panel-users.service';

@Injectable()
export class PanelUserLocalStrategy extends PassportStrategy(
  Strategy,
  'panel-user-local-auth',
) {
  constructor(
    private readonly panelUsersService: PanelUsersService,
    private readonly passwordService: PasswordService,
  ) {
    super({ usernameField: 'email' });
  }

  public async validate(email: string, password: string) {
    const user = await this.panelUsersService.findPanelUserByEmail(email);
    if (!user || user.isDeleted)
      throw new NotFoundException('User is not found');

    const isValidPassword = this.passwordService.validatePassword(
      password,
      user.password,
    );
    if (!isValidPassword) throw new BadRequestException('Invalid password');

    return user;
  }
}
