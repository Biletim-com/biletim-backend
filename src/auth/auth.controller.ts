import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserRequest } from './dto/loginUserRequest.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterUserRequest } from './dto/registerUserRequest.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { AuthGuard } from './auth.guard';
import { CreatePanelAdminDto } from './dto/create-panel-admin.dto';
import { VerificationDto } from './dto/verification.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

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

  @HttpCode(200)
  @Post('/verify')
  async appVerification(
    @Body() verificationDto: VerificationDto,
  ): Promise<any> {
    return this.authService.appVerification(+verificationDto.verificationCode);
  }

  @HttpCode(200)
  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @HttpCode(200)
  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.verificationCode,
      resetPasswordDto.newPassword,
    );
  }

  @Post('register-company')
  @HttpCode(200)
  async registerCompany(
    @Body() registerCompanyDto: RegisterCompanyDto,
  ): Promise<any> {
    return this.authService.registerCompany(registerCompanyDto);
  }
}
