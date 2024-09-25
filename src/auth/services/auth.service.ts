import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import type { Response } from 'express';

import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import { PasswordService } from './password.service';
import { OAuth2StrategyFactory } from '../factories/oauth2-strategy.factory';

import {
  RESET_PASSWORD_EMAIL_TEMPLATE,
  SIGNUP_VERIFY_EMAIL_TEMPLATE,
} from '@app/common/utils/emailTemplate';

import { User } from '@app/modules/users/user.entity';
import { UsersService } from '@app/modules/users/users.service';
import { UsersRepository } from '@app/modules/users/users.repository';

import { Verification } from '@app/modules/users/verification/verification.entity';
import { VerificationsRepository } from '@app/modules/users/verification/verification.repository';
import { PanelUser } from '@app/modules/panel-users/panel-user.entity';

// enums
import { EmailType } from '@app/common/enums/email-type.enum';

// dtos
import { LoginOAuth2Dto } from '../dto/login-oauth2.dto';
import { RegisterUserRequest } from '../dto/register-user-request.dto';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private oauth2StrategyFactory: OAuth2StrategyFactory,
    private usersService: UsersService,
    private tokenService: TokenService,
    private cookieService: CookieService,
    private usersRepository: UsersRepository,
    private verificationsRepository: VerificationsRepository,
    private passwordService: PasswordService,
  ) {}

  logout(response: Response): void {
    this.cookieService.removeAuthCookie(response);
  }

  login(user: User | PanelUser, response: Response): void {
    const tokens = this.tokenService.generateTokens(user);
    this.cookieService.setAuthCookie(tokens, response);
  }

  async register(registerUserRequest: RegisterUserRequest): Promise<any> {
    try {
      const { password, name, familyName } = registerUserRequest;
      const email = registerUserRequest.email.toLowerCase();
      const existUser = await this.usersService.findByEmail(email);
      if (existUser) {
        if (!existUser.isVerified) {
          const { verificationCode } = await this.uniqueSixDigitNumber();
          await this.verificationsRepository.update(
            { user: { id: existUser.id } },
            {
              verificationCode: verificationCode,
              isExpired: false,
              isUsed: false,
            },
          );
          console.log('Update finished');
          const emailOptions = {
            receiver: email,
            subject: 'Verification Biletim Server',
            htmlHeader: 'Verification',
            htmlBody: 'Biletim Server user verification code',
            htmlLink: `${verificationCode}`,
          };

          await this.sendEmail(EmailType.SIGNUP, emailOptions);

          throw new HttpException(
            'A verification code has been sent to your email address. Please verify your account.',
            HttpStatus.CONFLICT,
          );
        } else {
          throw new HttpException(
            'This email address is already in use.',
            HttpStatus.CONFLICT,
          );
        }
      }

      const user = await this.usersRepository.save(
        new User({
          email: email,
          password: this.passwordService.hashPassword(password),
          familyName: familyName,
          name: name,
        }),
      );

      // TODO: this should be done is DTO
      const { password: _, ...userWithoutPassword } = user;

      const { verificationCode } = await this.uniqueSixDigitNumber();
      await this.verificationsRepository.save(
        new Verification({
          user,
          verificationCode: verificationCode,
          isExpired: false,
          isUsed: false,
        }),
      );

      const emailOptions = {
        receiver: email,
        subject: 'Verification Biletim Server',
        htmlHeader: 'Verification',
        htmlBody: 'Biletim Server user verification code',
        htmlLink: `${verificationCode}`,
      };

      await this.sendEmail(EmailType.SIGNUP, emailOptions);

      return userWithoutPassword;
    } catch (err: any) {
      Logger.error(err);
      throw new HttpException(
        `Bad Request. Please check the payload -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async appVerification(verificationCode: number): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    if (verificationCode.toString().length !== 6) {
      throw new BadRequestException(
        'verificationCode must be 6 characters long.',
      );
    }
    try {
      const userId = await this.findUserIdByVerificationCode(verificationCode);
      const user = await this.usersService.findAppUserById(userId, {
        verification: true,
      });
      if (user.isVerified || user.isDeleted) {
        throw new BadRequestException('invalid verification code ');
      }

      const updatedUser = await this.usersRepository.save(
        new User({
          id: userId,
          isVerified: true,
          verification: new Verification({
            id: user.verification.id,
            isUsed: true,
          }),
        }),
      );
      return this.tokenService.generateTokens(updatedUser);
    } catch (err: any) {
      throw new HttpException(
        `company verification error ->  ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.usersRepository.findOneBy({
        email: email.toLowerCase(),
      });

      if (!user) {
        throw new BadRequestException('Invalid email');
      }
      const forgotPasswordCode: string = uuidv4();
      await this.usersRepository.update(
        { email: user.email },
        { forgotPasswordCode, isUsed: false },
      );

      const emailOptions = {
        receiver: user.email,
        subject: 'Password reset',
        htmlHeader: 'Password reset',
        htmlBody:
          'You requested to reset your password. Click the button below to reset it.',
        htmlButton: 'Reset password',
        htmlLink: `${process.env.RESET_PASSWORD_URL}?verificationCode=${forgotPasswordCode}`,
      };

      await this.sendEmail(EmailType.RESET_PASSWORD, emailOptions);

      return {
        message: 'Password reset email send successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (err: any) {
      throw new HttpException(
        `forgot password error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async resetPassword(forgotPasswordCode: string, newPassword: string) {
    try {
      const user = await this.usersService.getUserWithForgotPasswordCode(
        forgotPasswordCode,
      );
      if (forgotPasswordCode !== user.forgotPasswordCode || user.isUsed) {
        throw new BadRequestException('invalid verification code ');
      }
      if (user.password === newPassword) {
        throw new HttpException(
          'New password must be different from the old password',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.resetPasswordByEmail(user.email, newPassword);
      return {
        message: 'Successfuly reset password',
        statusCode: HttpStatus.OK,
      };
    } catch (err: any) {
      throw new HttpException(
        `reset password error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendEmail(type: EmailType, options: any) {
    let html: string | undefined = undefined;
    const { receiver, subject, htmlHeader, htmlBody, htmlButton, htmlLink } =
      options;

    if (type === EmailType.RESET_PASSWORD) {
      html = RESET_PASSWORD_EMAIL_TEMPLATE(
        htmlHeader,
        htmlBody,
        htmlButton,
        htmlLink,
      );
    } else if (type === EmailType.SIGNUP) {
      html = SIGNUP_VERIFY_EMAIL_TEMPLATE(htmlHeader, htmlBody, htmlLink);
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dws.timetracker@gmail.com',
        pass: 'zyyj jrjl syft egjh',
      },
    });

    transporter
      .sendMail({
        from: '"Biletim Server" <dws.timetracker@gmail.com>',
        to: receiver.toString(),
        subject: subject,
        text: 'Biletim Server',
        html,
      })
      .then((info) => {
        console.log({ info });
      })
      .catch(console.error);
  }

  async uniqueSixDigitNumber() {
    let verificationCode: number;
    // let expireTime;
    // const expirationTime = 10;

    do {
      verificationCode = Math.floor(100000 + Math.random() * 900000);

      // expireTime = Date.now() + expirationTime * 60 * 1000;
    } while (verificationCode.toString().length !== 6);

    return { verificationCode };
  }

  async findUserIdByVerificationCode(verificationCode: number) {
    const userVerification = await this.verificationsRepository.findOne({
      where: { verificationCode: verificationCode },
      relations: { user: true },
    });
    if (!userVerification)
      throw new HttpException(
        'Not found userId with verificationCode',
        HttpStatus.NOT_FOUND,
      );
    return userVerification.user.id;
  }

  async resetPasswordByEmail(email: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newPasswordHash = this.passwordService.hashPassword(newPassword);
    await this.usersRepository.update(
      {
        email: user.email,
      },
      {
        password: newPasswordHash,
        forgotPasswordCode: null,
        isUsed: true,
      },
    );
  }

  async changePassword(userId: UUID, oldPassword: string, newPassword: string) {
    try {
      const user = await this.usersService.findAppUserById(userId);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid = await this.passwordService.validatePassword(
        oldPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new HttpException(
          'Old password is incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (oldPassword === newPassword) {
        throw new HttpException(
          'New password must be different from the old password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newPasswordHash = this.passwordService.hashPassword(newPassword);
      await this.usersRepository.update(
        { id: user.id },
        { password: newPasswordHash },
      );
      return { message: 'your password changed', statusCode: 200 };
    } catch (err: any) {
      throw new HttpException(
        `change password error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
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
    let user = (await this.usersService.findByEmail(email)) as User;

    if (!user) {
      const password: string = uuidv4();
      // @ts-ignore
      user = await this.usersService.create({
        email: email,
        password: password,
        name: name,
        familyName: familyName,
      });
    }
    this.login(user, response);
    return user;
  }
}
