import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserRequest } from './dto/login-user-request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterUserRequest } from './dto/register-user-request.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { AuthGuard } from './auth.guard';
import { VerificationDto } from './dto/verification.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: ' Panel Login ' })
  @Post('/panel-login')
  @HttpCode(200)
  async panelLogin(@Body() loginUserDto: LoginUserRequest): Promise<any> {
    return this.authService.panelLogin(loginUserDto);
  }

  @ApiOperation({ summary: ' App Login ' })
  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserRequest): Promise<any> {
    return this.authService.login(loginUserDto);
  }

  @ApiOperation({ summary: ' Register User' })
  @Post('/signup')
  @HttpCode(200)
  async register(
    @Body() registerUserRequest: RegisterUserRequest,
  ): Promise<any> {
    return this.authService.register(registerUserRequest);
  }

  @ApiOperation({ summary: ' Verify App User' })
  @HttpCode(200)
  @Post('/verify')
  async appVerification(
    @Body() verificationDto: VerificationDto,
  ): Promise<any> {
    return this.authService.appVerification(+verificationDto.verificationCode);
  }

  @ApiOperation({ summary: ' Forgot Password' })
  @HttpCode(200)
  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiOperation({ summary: ' Reset Password' })
  @HttpCode(200)
  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.forgotPasswordCode,
      resetPasswordDto.newPassword,
    );
  }

  @ApiOperation({
    summary: 'App Change Password ',
  })
  @UseGuards(AuthGuard)
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

  @HttpCode(200)
  @Post('/login-google')
  async loginWithGoogle(@Body() body) {
    const userInfo = await this.authService.loginWithGoogle(body.token);
    return userInfo;
  }

  @Post('register-company')
  @HttpCode(200)
  async registerCompany(
    @Body() registerCompanyDto: RegisterCompanyDto,
  ): Promise<any> {
    return this.authService.registerCompany(registerCompanyDto);
  }
}
