import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from '../auth/auth.service';
import { PasswordService } from '../auth/password/password.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PanelUser } from '@prisma/client';
import { CreatePanelUserDto } from './dto/create-panel-user.dto';
import { EnvVariables } from '../common/env.variables';

@Injectable()
export class PanelUsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => PasswordService))
    private passwordService: PasswordService,
    private prisma: PrismaService,
  ) {}

  async getUsers(query): Promise<any> {
    try {
      const offset = !isNaN(parseInt(query.offset))
        ? parseInt(query.offset)
        : 0;
      const limit = !isNaN(parseInt(query.limit)) ? parseInt(query.limit) : 10;
      const fullName = query.fullName;
      const compId = parseInt(query.company_id);

      let whereConditions: any = {
        AND: [],
      };

      if (fullName && fullName.length > 0) {
        const name = fullName.toLowerCase().split(' ')[0];
        const familyName = fullName.toLowerCase().split(' ')[1];
        whereConditions.AND.push({
          name: { contains: name, mode: 'insensitive' },
        });
        whereConditions.AND.push({
          familyName: { contains: familyName, mode: 'insensitive' },
        });
      }

      if (compId) {
        whereConditions.AND.push({ company_id: { equals: compId } });
      }

      if (!whereConditions.AND.length) {
        whereConditions = {};
      }

      const totalUsers = await this.prisma.panelUser.findMany({
        skip: offset,
        take: limit,
        where: whereConditions,
      });
      const users = totalUsers.map((user) => {
        const { password, ...rest } = user;
        return rest;
      });
      return users;
    } catch (err: any) {
      throw new HttpException(
        `user get error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<PanelUser> {
    const user = await this.prisma.panelUser.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    delete user.password;
    return user;
  }

  async createSuperAdmin(key: string): Promise<any> {
    const adminVariables = EnvVariables.getSuperAdminVariables();
    if (key !== adminVariables.superAdminKey)
      throw new HttpException('key is not correct', HttpStatus.BAD_REQUEST);

    const existUser = await this.prisma.panelUser.findFirst({
      where: {
        email: adminVariables.superAdminEmail,
        isSUPER_ADMIN: true,
      },
    });
    if (existUser) {
      throw new HttpException('super admin already exist', HttpStatus.CONFLICT);
    }

    try {
      const user = await this.prisma.panelUser.create({
        data: {
          name: 'SUPER',
          familyName: 'ADMIN',
          email: adminVariables.superAdminEmail,
          password: bcrypt.hashSync(adminVariables.superAdminPassword, 10),
          isSUPER_ADMIN: true,
        },
      });

      delete user.password;

      return { message: 'Super admin created', statusCode: '201' };
    } catch (err: any) {
      throw new HttpException(
        `Super Admin create error -> ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteAdmin(id: string, req: any): Promise<any> {
    try {
      const ReqUser = await this.findPanelUserByEmail(req.email);
      if (!ReqUser)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      if (!ReqUser.isSUPER_ADMIN) {
        throw new HttpException(
          'You are not authorized to perform this action',
          HttpStatus.FORBIDDEN,
        );
      }
      const user = await this.findPanelUserById(id);

      if (!user)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      await this.prisma.panelUser.delete({
        where: { id },
      });
      return { message: 'user deleted', statusCode: '200' };
    } catch (err: any) {
      throw new HttpException(
        `Super Admin delete error -> ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPanelAdmin(data: CreatePanelUserDto): Promise<any> {
    try {
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

  async updateUser(userId: string, data: CreatePanelUserDto): Promise<any> {
    try {
      const { email } = data;
      const user = await this.findPanelUserById(userId);
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
      const checkEmail = await this.findPanelUserByEmail(email);

      if (checkEmail && user.email !== checkEmail.email)
        throw new HttpException(
          'this email address is already used by someone else',
          HttpStatus.BAD_REQUEST,
        );

      await this.prisma.panelUser.update({
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

  async delete(userId: string): Promise<any> {
    try {
      const user = await this.prisma.panelUser.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      await this.prisma.panelUser.delete({
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

  async panelChangePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    let user: any;
    try {
      user = await this.findPanelUserById(userId);

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

      await this.prisma.panelUser.update({
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

  async findPanelUserByEmail(email: string) {
    return this.prisma.panelUser.findUnique({
      where: { email },
    });
  }
  async findPanelUserById(id: string) {
    const panelUser = await this.prisma.panelUser.findFirst({
      where: {
        id,
      },
    });
    if (!panelUser) {
      throw new NotFoundException(`Panel User not found with this id`);
    }

    return panelUser;
  }

  async isPanelUser(userId: string): Promise<boolean> {
    const panelUser = await this.prisma.panelUser.findFirst({
      where: { id: userId },
    });
    return !!panelUser;
  }
}
