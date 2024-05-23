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
import { PasswordService } from 'src/auth/password/password.service';
import { PanelUsersService } from 'src/panel-users/panel-users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => PasswordService))
    private passwordService: PasswordService,
    @Inject(forwardRef(() => PanelUsersService))
    private panelUsersService: PanelUsersService,
    private prisma: PrismaService,
  ) {}
  async create(createUserDto: CreateUserDto, reqUserId: any): Promise<User> {
    try {
      const { password, name, familyName } = createUserDto;

      const email = createUserDto.email.toLowerCase();
      const existUser = await this.findByEmail(email);
      if (existUser) {
        throw new HttpException(
          'This email address is already in use',
          HttpStatus.CONFLICT,
        );
      }

      const reqUser = await this.panelUsersService.findPanelUserById(reqUserId);
      if (!reqUser || (reqUser && reqUser.isDeleted)) {
        throw new HttpException(
          'Your account is deleted, you cannot do this operation',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await this.prisma.user.create({
        data: {
          name: name,
          familyName: familyName,
          email: email,
          password: hashedPassword,
          isVerified: true,
        },
      });
      delete user.password;
      return user;
    } catch (err: any) {
      throw new HttpException(
        `user create error ->  ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(userId: string, data: CreateUserDto): Promise<any> {
    try {
      const { email } = data;
      const user = await this.findAppUserById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      if (user.isDeleted)
        throw new HttpException(
          'user not active, please contact your super admin',
          HttpStatus.NOT_FOUND,
        );
      const checkEmail = await this.findByEmail(email);

      if (checkEmail && user.email !== checkEmail.email)
        throw new HttpException(
          'this email address is already used by someone else',
          HttpStatus.BAD_REQUEST,
        );

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
        },
      });
      return { message: 'user updated', statusCode: 200 };
    } catch (err: any) {
      throw new HttpException(
        `user update error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
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

  async delete(reqUserId: string, userId: string) {
    console.log(userId);
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const reqUser = await this.panelUsersService.findPanelUserById(reqUserId);
      if (!reqUser || (reqUser && reqUser.isDeleted)) {
        throw new HttpException(
          'Your account is deleted, you cannot do this operation',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
      return { message: 'user deleted', statusCode: 200 };
    } catch (err: any) {
      throw new HttpException(
        `user delete error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
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
}
