import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { AUTH_STRATEGY_TOKEN, AuthStrategy } from './auth.strategy';
import { LoginUserRequest } from './dto/loginUserRequest.dto';
import { PasswordService } from './password/password.service';
import { RegisterUserRequest } from './dto/registerUserRequest.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    @Inject(AUTH_STRATEGY_TOKEN) private readonly authStrategy: AuthStrategy,
  ) {}

  async login(LoginUserRequestDto: LoginUserRequest) {
    const { email, password } = LoginUserRequestDto;

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
      }
      const isPasswordValid = await this.passwordService.validatePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
      }
      const responseObj = {
        ...user,
        access_token: this.generateToken(user),
      };

      return Promise.resolve(responseObj);
    } catch (err) {
      Logger.error(err);
      throw new HttpException(
        'Bad Request. Please check the payload',
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
  protected generateToken(user: any) {
    return {
      access_token: this.jwtService.sign({
        id: user.id,
        sub: user.sub,
        email: user.email,
        name: user.name,
        family_name: user.family_name,
        company_id: user.company_id,
        role_id: user.role_id,
      }),
    };
  }
  async register(registerUserRequest: RegisterUserRequest) {
    const { email, password, name, familyName, phone, address, isAdmin } =
      registerUserRequest;
    let role: any = {};
    if (isAdmin) {
      role = await this.prisma.userRoles.findFirst({
        where: {
          name: 'admin',
        },
      });
    } else {
      role = await this.prisma.userRoles.findFirst({
        where: {
          name: 'user',
        },
      });
    }
    try {
      const user = await this.prisma.user.create({
        data: {
          role: {
            connect: {
              id: role.id,
            },
          },
          company: {
            connect: {
              id: registerUserRequest.company_id,
            },
          },
          email: email,
          password: await this.passwordService.hashPassword(password),
          phone: phone ?? null,
          address: address ?? null,
          name: name,
          familyName: familyName,
        },
      });
      if (!user) {
        throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
      }
      const responseObj = {
        ...user,
        access_token: this.generateToken(user),
      };

      return Promise.resolve(responseObj);
    } catch (err) {
      Logger.error(err);
      throw new HttpException(
        'Bad Request. Please check the payload',
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
}
