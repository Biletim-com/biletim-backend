import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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
  async findById(id: string) {
    const appUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    const panelUser = await this.prisma.panelUser.findUnique({
      where: {
        id,
      },
    });
    if (appUser) {
      return appUser;
    } else if (panelUser) {
      return panelUser;
    } else {
      return HttpStatus.NOT_FOUND;
    }
  }
  async getUserWithVerificationCode(verificationCode: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { verificationCode: verificationCode },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${verificationCode} not found`);
    }
    return user;
  }

  // async createPanelAdmin(
  //   data: CreatePanelAdminDto,
  //   role_id: any,
  // ): Promise<any> {
  //   try {
  //     const reqRole = await this.prisma.userRoles.findFirst({
  //       where: {
  //         id: role_id,
  //       },
  //     });
  //     const reqRoleName = reqRole.name;
  //     if (reqRoleName !== 'SUPER_ADMIN') {
  //       throw new HttpException(
  //         'You do not have permission for this operation',
  //         HttpStatus.FORBIDDEN,
  //       );
  //     }

  //     const { name, familyName, email, password } = data;

  //     const existUser = await this.prisma.panelUser.findFirst({
  //       where: {
  //         email: email,
  //       },
  //     });

  //     if (existUser) {
  //       if (existUser.isDeleted) {
  //         throw new HttpException(
  //           'Your account is not active, please contact your administrator',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }

  //       this.logger.error('A user already exists with this email');
  //       throw new HttpException(
  //         'A user already exists with this email',
  //         HttpStatus.CONFLICT,
  //       );
  //     }

  //     let role: any;
  //     let User: any;
  //     const responseObj = await this.prisma.$transaction(async (tx) => {
  //       role = await tx.userRoles.create({
  //         data: {
  //           name: 'ADMIN',
  //         },
  //       });

  //       User = await tx.panelUser.create({
  //         data: {
  //           role: {
  //             connect: {
  //               id: role.id,
  //             },
  //           },
  //           email: email,
  //           password: await this.passwordService.hashPassword(password),
  //           name: name,
  //           familyName: familyName,
  //         },
  //       });
  //       delete User.password;
  //       const { accessToken, refreshToken } = await this.generateTokens(User);
  //       return {
  //         ...User,
  //         tokens: { accessToken, refreshToken },
  //       };
  //     });
  //     return responseObj;
  //   } catch (err: any) {
  //     throw new HttpException(
  //       `Bad Request. Please check the payload -> ${err?.message} `,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
