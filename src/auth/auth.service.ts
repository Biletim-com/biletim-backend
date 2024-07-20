import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { AUTH_STRATEGY_TOKEN, AuthStrategy } from './auth.strategy';
import { LoginUserRequest } from './dto/loginUserRequest.dto';
import { PasswordService } from './password/password.service';
import { RegisterUserRequest } from './dto/registerUserRequest.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { UsersService } from '../users/users.service';
import {
  RESET_PASSWORD_EMAIL_TEMPLATE,
  SIGNUP_VERIFY_EMAIL_TEMPLATE,
} from 'src/utils/emailTemplate';
import { EmailType } from 'src/types/email-type';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { PanelUsersService } from 'src/panel-users/panel-users.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private panelUsersService: PanelUsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    @Inject(AUTH_STRATEGY_TOKEN) private readonly authStrategy: AuthStrategy,
  ) {}

  async login(LoginUserRequestDto: LoginUserRequest): Promise<any> {
    const { email, password } = LoginUserRequestDto;
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!user || user.isDeleted) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      if (!user.isVerified) {
        throw new HttpException(
          'user not yet verified',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const isPasswordValid = await this.passwordService.validatePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('invalid password  ', HttpStatus.UNAUTHORIZED);
      }
      delete user.password;
      const { accessToken, refreshToken } = await this.generateTokens(user);
      const responseObj = {
        ...user,
        tokens: { accessToken, refreshToken },
      };

      return Promise.resolve(responseObj);
    } catch (err: any) {
      Logger.error(err);
      throw new HttpException(
        ` Bad Request. Please check the payload -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async panelLogin(LoginUserRequestDto: LoginUserRequest): Promise<any> {
    const { email, password } = LoginUserRequestDto;
    try {
      const user = await this.prisma.panelUser.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      const isPasswordValid = await this.passwordService.validatePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
      }
      delete user.password;
      const { accessToken, refreshToken } = await this.generateTokens(user);
      const responseObj = {
        ...user,
        tokens: { accessToken, refreshToken },
      };

      return Promise.resolve(responseObj);
    } catch (err: any) {
      Logger.error(err);
      throw new HttpException(
        ` Bad Request. Please check the payload -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async authenticate(access_token: string): Promise<any> {
    try {
      const user = await this.authStrategy.validate(access_token);
      return Promise.resolve(user);
    } catch (err: any) {
      Logger.error(err?.message);
      throw new Error(err?.message);
    }
  }
  async generateTokens(user: any) {
    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      familyName: user.familyName,
    };
    const refreshTokenPayload = {
      sub: user.id,
      type: 'refresh',
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: '2d',
    });
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async register(registerUserRequest: RegisterUserRequest): Promise<any> {
    try {
      const { password, name, familyName } = registerUserRequest;
      const email = registerUserRequest.email.toLowerCase();
      const existUser = await this.usersService.findByEmail(email);

      if (existUser) {
        if (!existUser.isVerified) {
          const { verificationCode } = await this.uniqueSixDigitNumber();
          await this.prisma.verification.update({
            where: { user_id: existUser.id },
            data: {
              verificationCode: verificationCode,
              isExpired: false,
              isUsed: false,
            },
          });

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

      const user = await this.prisma.user.create({
        data: {
          email: email,
          password: await this.passwordService.hashPassword(password),
          name: name,
          familyName: familyName,
        },
      });

      delete user.password;

      const { accessToken, refreshToken } = await this.generateTokens(user);
      const responseObj = {
        ...user,
        tokens: { accessToken, refreshToken },
      };

      const { verificationCode } = await this.uniqueSixDigitNumber();
      await this.prisma.verification.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          verificationCode: verificationCode,
          isExpired: false,
          isUsed: false,
        },
      });

      const emailOptions = {
        receiver: email,
        subject: 'Verification Biletim Server',
        htmlHeader: 'Verification',
        htmlBody: 'Biletim Server user verification code',
        htmlLink: `${verificationCode}`,
      };

      await this.sendEmail(EmailType.SIGNUP, emailOptions);

      return responseObj;
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
    let user: any;
    let userId: any;
    try {
      userId = await this.findUserIdByVerificationCode(verificationCode);
      user = await this.usersService.findAppUserById(userId);
      if (user.isVerified || user.isDeleted) {
        throw new BadRequestException('invalid verification code ');
      }
      const responseObj = await this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { isVerified: true },
        });
        await tx.verification.update({
          where: { user_id: userId },
          data: { isUsed: true },
        });

        const { accessToken, refreshToken } = await this.generateTokens(user);
        return { accessToken, refreshToken };
      });

      return responseObj;
    } catch (err: any) {
      throw new HttpException(
        `company verification error ->  ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        throw new BadRequestException('Invalid email');
      }
      const forgotPasswordCode: string = uuidv4();
      await this.prisma.user.update({
        where: { email: user.email },
        data: { forgotPasswordCode, isUsed: false },
      });

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

  async registerCompany(registerCompanyDto: RegisterCompanyDto) {
    return this.prisma.company.create({
      data: {
        ...registerCompanyDto,
      },
    });
  }

  async sendEmail(type: EmailType, options: any) {
    let html;
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
    const userVerification = await this.prisma.verification.findFirst({
      where: {
        verificationCode: verificationCode,
      },
      select: {
        user_id: true,
      },
    });
    if (!userVerification)
      throw new HttpException(
        'Not found userId with verificationCode',
        HttpStatus.NOT_FOUND,
      );
    return userVerification.user_id;
  }
  async resetPasswordByEmail(email: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: newPasswordHash,
        forgotPasswordCode: null,
        isUsed: true,
      },
    });
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    let user: any;
    try {
      user = await this.usersService.findAppUserById(userId);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

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

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: newPasswordHash },
      });
      return { message: 'your password changed', statusCode: 200 };
    } catch (err: any) {
      throw new HttpException(
        `change password error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async loginWithGoogle(token: string) {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`;
    try {
      const response = await axios.get(url);
      const userInfo = response.data;
      // İsteğin başarılı olup, olmadığının kontrolü
      if (response.status !== 200 || !userInfo) {
        throw new BadRequestException(
          `Google API request failed. Status: ${response.status}`,
        );
      }
      // Kullanıcıyı e-posta adresiyle bulma
      const user = await this.usersService.findByEmail(userInfo.email);

      // Eğer kullanıcı yoksa, kayıt ol ve oturum aç
      if (!user) {
        console.log('REGISTER');
        const password: string = uuidv4();

        const signUpResult = await this.signUpWithGoogle({
          email: userInfo.email,
          password: password,
          name: userInfo.given_name ?? 'firstname',
          familyName: userInfo.family_name ?? 'lastname',
        });

        return signUpResult;
      } else {
        console.log('LOGIN');
        // Eğer kullanıcı varsa, sadece oturum aç
        const signInResult = await this.signInWithGoogle(user.email, userInfo);

        return signInResult;
      }
    } catch (error) {
      //HTTP hatası oluştuğunda veya başka bir hata durumunda buraya düşer
      throw new BadRequestException(`ERR: Google API request failed`);
    }
  }

  async signUpWithGoogle(createUserDto: RegisterUserRequest): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    createUserDto.email = createUserDto.email.toLowerCase();
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new HttpException(
        'This email address already in use',
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.usersService.create(createUserDto);

    const { accessToken, refreshToken } = await this.generateTokens(user);
    return { accessToken, refreshToken };
  }

  async signInWithGoogle(email: string, userInfo: any) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userInfo.email != email) {
      throw new BadRequestException(
        'Invalid Google token: emails do not match',
      );
    }
    const { accessToken, refreshToken } = await this.generateTokens(user);
    return { accessToken, refreshToken };
  }

  async createAccessToken(user: any) {
    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      familyName: user.familyName,
    };
    const accessToken: string = this.jwtService.sign(accessTokenPayload, {
      expiresIn: '2d',
    });
    return accessToken;
  }

  async findAndValidateUserByRefreshToken(token: any): Promise<any> {
    let user: any;
    try {
      const decoded = this.jwtService.verify(token);

      if (decoded?.type != 'refresh') {
        throw new Error('Invalid refresh token');
      }
      const userId = decoded.sub;
      const isPanelUser = await this.panelUsersService.isPanelUser(userId);
      if (isPanelUser) {
        user = await this.panelUsersService.findPanelUserById(userId);
      } else {
        user = await this.usersService.findOne(userId);
      }

      return user;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
