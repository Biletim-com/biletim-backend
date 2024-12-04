import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Req,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import type { Response } from 'express';

import { CurrentUser } from '@app/common/decorators';
import { User } from '@app/modules/users/user.entity';
import { PanelUser } from '@app/modules/panel-users/panel-user.entity';

// services
import { AuthService } from './services/auth.service';

// dtos
import { RegisterUserRequest } from './dto/register-user-request.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerificationCodeDto, VerificationDto } from './dto/verification.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { LoginUserRequest } from './dto/login-user-request.dto';
import { LoginOAuth2Dto } from './dto/login-oauth2.dto';
import { UserWithoutPasswordDto } from './dto/user-without-password.dto';
import { PanelUserWithoutPasswordDto } from '@app/modules/panel-users/dto/panel-user-without-password.dto';

// guards
import { PanelUserLocalAuthGuard } from './guards/panel-user-local-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Panel User Login' })
  @Post('/panel-login')
  @HttpCode(200)
  @UseGuards(PanelUserLocalAuthGuard)
  async panelLogin(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: PanelUser,
    @Body() _: LoginUserRequest,
  ): Promise<PanelUserWithoutPasswordDto> {
    this.authService.login(user, response);
    return new PanelUserWithoutPasswordDto(user);
  }

  @ApiOperation({ summary: 'App Login' })
  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: User,
    @Body() _: LoginUserRequest,
  ): Promise<UserWithoutPasswordDto> {
    this.authService.login(user, response);
    return new UserWithoutPasswordDto(user);
  }

  @ApiOperation({ summary: 'App Logout' })
  @Post('/logout')
  @HttpCode(200)
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ result: true }> {
    this.authService.logout(response);
    return { result: true };
  }

  @ApiOperation({ summary: 'Find Me App User' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/me')
  getMe(@CurrentUser() user: User): UserWithoutPasswordDto {
    return new UserWithoutPasswordDto(user);
  }

  @ApiOperation({
    summary: 'Login with OAuth2 ',
  })
  @HttpCode(200)
  @Post('/login-oauth')
  async loginWithOAuth2(
    @Res({ passthrough: true }) response: Response,
    @Body() loginOAuth2Dto: LoginOAuth2Dto,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.authService.loginWithOAuth2(
      loginOAuth2Dto,
      response,
    );
    return new UserWithoutPasswordDto(user);
  }

  @ApiOperation({ summary: 'Register User' })
  @Post('/signup')
  @HttpCode(200)
  async register(
    @Body() registerUserRequest: RegisterUserRequest,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.authService.register(registerUserRequest);
    return new UserWithoutPasswordDto(user);
  }


  @ApiOperation({ summary: 'Sent Verify Code' })
  @ApiCookieAuth()
  @HttpCode(200)
  @Post('/sent-verify-code')
  async sentVerificationCode(
    @Res({ passthrough: true }) response: Response,
    @Body() verificationDto: VerificationCodeDto,
  ): Promise<any> {
    return this.authService.sentVerificationCode(verificationDto, response);
  }


  @ApiOperation({ summary: 'Verify App User' })
  @ApiCookieAuth()
  @HttpCode(200)
  @Post('/verify')
  async appVerification(
    @Res({ passthrough: true }) response: Response,
    @Body() verificationDto: VerificationDto,
  ): Promise<any> {
    return this.authService.appVerification(verificationDto, response);
  }

  @ApiOperation({ summary: 'Forgot Password' })
  @ApiCookieAuth()
  @HttpCode(200)
  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiOperation({ summary: 'Reset Password' })
  @ApiCookieAuth()
  @HttpCode(200)
  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.forgotPasswordCode,
      resetPasswordDto.newPassword,
    );
  }

  @ApiOperation({
    summary: 'App Change Password',
  })
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Patch('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ): Promise<any> {
    return this.authService.changePassword(
      req?.user?.sub,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}
