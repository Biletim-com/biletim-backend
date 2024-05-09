import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserRequest } from './dto/loginUserRequest.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserRequest } from './dto/registerUserRequest.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async loginClientWithCode(
    @Body() loginUserDto: LoginUserRequest,
  ): Promise<any> {
    return this.authService.login(loginUserDto);
  }

  @Post('signup')
  @HttpCode(200)
  async register(
    @Body() registerUserRequest: RegisterUserRequest,
  ): Promise<any> {
    return this.authService.register(registerUserRequest);
  }

  @Post('register-company')
  @HttpCode(200)
  async registerCompany(
    @Body() registerCompanyDto: RegisterCompanyDto,
  ): Promise<any> {
    return this.authService.registerCompany(registerCompanyDto);
  }
}