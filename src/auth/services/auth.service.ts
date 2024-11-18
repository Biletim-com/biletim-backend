import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { Response } from 'express';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import { PasswordService } from './password.service';
import { OAuth2StrategyFactory } from '../factories/oauth2-strategy.factory';
import { User } from '@app/modules/users/user.entity';
import { UsersService } from '@app/modules/users/users.service';
import { PanelUser } from '@app/modules/panel-users/panel-user.entity';

// dtos
import { LoginOAuth2Dto } from '../dto/login-oauth2.dto';
import { RegisterUserRequest } from '../dto/register-user-request.dto';

// types
import { UUID } from '@app/common/types';
import { VerificationService } from '@app/modules/users/verification/verification.service';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';
import { VerificationDto } from '../dto/verification.dto';
import { CreateUserDto } from '@app/modules/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private oauth2StrategyFactory: OAuth2StrategyFactory,
    private usersService: UsersService,
    private tokenService: TokenService,
    private cookieService: CookieService,
    private verificationService: VerificationService,
    private passwordService: PasswordService,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  logout(response: Response): void {
    this.cookieService.removeAuthCookie(response);
  }

  login(user: User | PanelUser, response: Response): void {
    const tokens = this.tokenService.generateTokens(user);
    this.cookieService.setAuthCookie(tokens, response);
  }

  async register(registerUserRequest: RegisterUserRequest): Promise<User> {
    const existingUser = await this.usersService.registerEmailCheck(
      registerUserRequest.email.toLowerCase(),
    );

    let user: User;
    let verificationCode: number;

    if (!existingUser) {
      user = await this.usersService.registerUser(registerUserRequest);
      verificationCode = await this.verificationService.createVerificationCode(
        user,
      );
    } else {
      user = existingUser;
      verificationCode = await this.verificationService.updateVerificationCode(
        user,
      );
    }

    this.eventEmitter.emitEvent('user.created', {
      recipient: user.email,
      verificationCode,
    });

    return user;
  }

  async appVerification(
    dto: VerificationDto,
    response: Response,
  ): Promise<{ message: string; statusCode: number }> {
    const { verificationCode } = dto;

    const userId = await this.verificationService.findUserIdByVerificationCode(
      +verificationCode,
    );

    const user = await this.usersService.findAppUserById(userId, {
      verification: true,
    });

    if (user.isVerified || user.isDeleted) {
      throw new BadRequestException('invalid verification code ');
    }

    const updatedUser = await this.usersService.updateVerificationStatus(
      userId,
      user.verification.id,
    );

    this.login(updatedUser, response);

    return {
      message: 'Verification completed successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    const forgotPasswordCode: string = uuidv4();

    await this.usersService.updateUserPasswordCode(email, forgotPasswordCode);

    this.eventEmitter.emitEvent('user.password.reset', {
      recipient: user.email,
      forgotPasswordCode,
    });

    return {
      message: 'Password reset email send successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async resetPassword(forgotPasswordCode: string, newPassword: string) {
    const user = await this.usersService.getUserWithForgotPasswordCode(
      forgotPasswordCode,
    );

    if (forgotPasswordCode !== user.forgotPasswordCode || user.isUsed) {
      throw new BadRequestException('invalid verification code ');
    }

    await this.resetPasswordByEmail(user.email, newPassword);

    return {
      message: 'Successfuly reset password',
      statusCode: HttpStatus.OK,
    };
  }

  async resetPasswordByEmail(email: string, newPassword: string) {
    await this.usersService.findByEmail(email);

    const newPasswordHash = this.passwordService.hashPassword(newPassword);

    await this.usersService.updateUserPassword(email, newPasswordHash);
  }

  async changePassword(userId: UUID, oldPassword: string, newPassword: string) {
    const user = await this.usersService.findAppUserById(userId);

    const isPasswordValid = await this.passwordService.validatePassword(
      oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const newPasswordHash = this.passwordService.hashPassword(newPassword);

    await this.usersService.updateUserPassword(
      user.email,
      newPasswordHash,
      false,
    );

    return {
      message: 'Password changed successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async loginWithOAuth2(
    requestDto: LoginOAuth2Dto,
    response: Response,
  ): Promise<User> {
    const { provider, code, redirectUri } = requestDto;

    const strategy = this.oauth2StrategyFactory.getStrategy(provider);

    const { email, name, familyName } = await strategy.getUserCredentials(
      code,
      redirectUri,
    );

    if (!email) {
      throw new BadRequestException(
        'Email cannot be undefined for user lookup.',
      );
    }

    let user = (await this.usersService.findByEmailWithoutThrowError(
      email,
    )) as User;

    if (!user) {
      const password: string = uuidv4();
      const createUserDto: CreateUserDto = {
        email: email,
        password: password,
        name: name,
        familyName: familyName,
      };
      user = await this.usersService.create(createUserDto);
    }

    this.login(user, response);
    return user;
  }
}
