import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';
import { CreatePanelAdminDto } from './dto/create-panel-admin.dto';
import { PasswordService } from 'src/auth/password/password.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => PasswordService))
    private passwordService: PasswordService,
    private prisma: PrismaService,
  ) {}
  // async create(createUserDto: any, user: any) {
  //   const role = await this.prisma.user.findUnique({
  //     where: {
  //       id: user.id,
  //     },
  //     include: {
  //       role: true,
  //     },
  //   });
  //   if (role.role.name !== 'admin') {
  //     throw new HttpException('Unauthorized', 401);
  //   }

  //   return this.prisma.user.create({
  //     data: createUserDto,
  //   });
  // }
  // async findAll(reqUser: any) {
  //   const sysUser = await this.prisma.user.findUnique({
  //     include: {
  //       role: true,
  //       company: true,
  //     },
  //     where: {
  //       id: reqUser.id,
  //     },
  //   });

  //   if (sysUser.role.name == 'admin') {
  //     return this.prisma.user.findMany();
  //   } else {
  //     return this.prisma.user.findMany({
  //       where: {
  //         company_id: sysUser.company.id,
  //       },
  //     });
  //   }
  // }
  // async findOne(user: any, id: string) {
  //   const userFound = await this.prisma.user.findUnique({
  //     include: {
  //       role: true,
  //       company: true,
  //     },
  //     where: {
  //       id: id,
  //     },
  //   });
  //   if (!userFound) {
  //     throw new HttpException('User not found', 404);
  //   }
  //   if (
  //     userFound.role.name !== 'admin' &&
  //     userFound.company_id !== user.company_id
  //   ) {
  //     throw new HttpException('Unauthorized', 401);
  //   }
  //   return this.prisma.user.findUnique({
  //     where: {
  //       id: id,
  //     },
  //     include: {
  //       role: true,
  //       company: true,
  //     },
  //   });
  // }

  // async update(user: any, id: string, data: any) {
  //   const userFound = await this.prisma.user.findUnique({
  //     include: {
  //       role: true,
  //       company: true,
  //     },
  //     where: {
  //       id: id,
  //     },
  //   });
  //   if (!userFound) {
  //     throw new HttpException('User not found', 404);
  //   }
  //   if (
  //     userFound.role.name !== 'admin' &&
  //     userFound.company_id !== user.company_id
  //   ) {
  //     throw new HttpException('Unauthorized', 401);
  //   }
  //   return this.prisma.user.update({
  //     where: {
  //       id: id,
  //     },
  //     data: data,
  //   });
  // }
  // async remove(user: any, id: string) {
  //   const userFound = await this.prisma.user.findUnique({
  //     include: {
  //       role: true,
  //       company: true,
  //     },
  //     where: {
  //       id: id,
  //     },
  //   });
  //   if (!userFound) {
  //     throw new HttpException('User not found', 404);
  //   }
  //   if (
  //     userFound.role.name !== 'ADMIN' &&
  //     userFound.company_id !== user.company_id
  //   ) {
  //     throw new HttpException('Unauthorized', 401);
  //   }
  //   return this.prisma.user.delete({
  //     where: {
  //       id: id,
  //     },
  //   });
  // }
  // async me(user: any) {
  //   return this.prisma.user.findUnique({
  //     include: {
  //       role: true,
  //       company: true,
  //     },
  //     where: {
  //       id: user.id,
  //     },
  //   });
  // }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findPanelUserByEmail(email: string) {
    return this.prisma.panelUser.findUnique({
      where: { email },
    });
  }
  async findPanelUserById(id: string) {
    const panelUser = await this.prisma.panelUser.findUnique({
      where: {
        id,
      },
    });
    if (!panelUser) {
      throw new NotFoundException(`User not found with this id`);
    }

    return panelUser;
  }

  async findAppUserById(id: string) {
    const appUser = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!appUser) {
      throw new NotFoundException(`User not found with this id`);
    }

    return appUser;
  }

  async getUserWithForgotPasswordCode(
    forgotPasswordCode: string,
  ): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { forgotPasswordCode: forgotPasswordCode },
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${forgotPasswordCode} not found`,
      );
    }
    return user;
  }

  async createPanelAdmin(
    data: CreatePanelAdminDto,
    reqUserId: any,
  ): Promise<any> {
    let reqUser;
    try {
      reqUser = await this.findPanelUserById(reqUserId);

      if (!reqUser.isSUPER_ADMIN) {
        throw new HttpException(
          'You do not have permission for this operation',
          HttpStatus.FORBIDDEN,
        );
      }

      const { name, familyName, email, password } = data;

      const existUser = await this.prisma.panelUser.findFirst({
        where: {
          email: email,
        },
      });

      if (existUser) {
        if (existUser.isDeleted) {
          throw new HttpException(
            'Your account is not active, please contact your administrator',
            HttpStatus.BAD_REQUEST,
          );
        }
        throw new HttpException(
          'A user already exists with this email',
          HttpStatus.CONFLICT,
        );
      }

      const user = await this.prisma.panelUser.create({
        data: {
          name: name,
          familyName: familyName,
          email: email,
          password: await this.passwordService.hashPassword(password),
        },
      });
      delete user.password;
      const { accessToken, refreshToken } =
        await this.authService.generateTokens(user);
      return {
        ...user,
        tokens: { accessToken, refreshToken },
      };
    } catch (err: any) {
      throw new HttpException(
        `Bad Request. Please check the payload -> ${err?.message} `,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
