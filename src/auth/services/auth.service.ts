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
import { VerificationService } from '@app/modules/verification/verification.service';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';
import { VerificationCodeDto, VerificationDto } from '../dto/verification.dto';
import { CreateUserDto } from '@app/modules/users/dto/create-user.dto';
import { DateTimeHelper } from '@app/common/helpers';

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

  async signup(registerUserRequest: RegisterUserRequest): Promise<User> {
    const existingUser = await this.usersService.registerEmailCheck(
      registerUserRequest.email.toLowerCase(),
    );

    if (existingUser) {
      throw new BadRequestException('User already exist');
    }

    return this.usersService.registerUser(registerUserRequest);
  }

  async sendAccountVerificationCode(dto: VerificationCodeDto): Promise<void> {
    const { email } = dto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isDeleted || user.isVerified) {
      throw new BadRequestException(
        user.isVerified ? 'User is already verified' : 'User is deleted',
      );
    }

    const verificationCode =
      await this.verificationService.createProfileActivationVerificationCode(
        user,
      );
    this.eventEmitter.emitEvent('user.created', {
      recipient: email,
      verificationCode,
    });
  }

  async verifyAccount(dto: VerificationDto, response: Response): Promise<void> {
    const { email, verificationCode } = dto;

    const verificationData =
      await this.verificationService.findByEmailAndVerificationCode(
        email,
        +verificationCode,
      );

    if (!verificationData?.user) {
      throw new BadRequestException('User not found');
    }
    const user = verificationData.user;
    if (user.isDeleted || user.isVerified) {
      throw new BadRequestException(
        user.isVerified ? 'User is already verified' : 'User is deleted',
      );
    }

    if (verificationData.isUsed) {
      throw new BadRequestException('This code is already used');
    }
    const isCodeExpired = DateTimeHelper.isTimeExpired(
      verificationData.expiredAt,
    );
    if (isCodeExpired) {
      throw new BadRequestException('Verification code has expired');
    }

    await this.usersService.updateVerificationStatus(
      user.id,
      verificationData.id,
    );

    this.login(user, response);
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

    let user = await this.usersService.findByEmailWithoutThrowError(email);

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
