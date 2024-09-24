import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UsersService } from '@app/modules/users/users.service';
import { PasswordService } from '../services/password.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) {
    super({ usernameField: 'email' });
  }

  public async validate(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.isDeleted)
      throw new NotFoundException('User is not found');
    if (!user.isVerified) throw new ForbiddenException('User is not verified');

    const isValidPassword = this.passwordService.validatePassword(
      password,
      user.password,
    );
    if (!isValidPassword) throw new BadRequestException('Invalid password');

    return user;
  }
}
