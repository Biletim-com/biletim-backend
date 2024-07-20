import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

      const totalUsers = await this.prisma.user.findMany({
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

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    delete user.password;
    return user;
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
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

  async updateUser(
    reqId: any,
    userId: string,
    data: CreateUserDto,
  ): Promise<any> {
    try {
      const reqUser = await this.panelUsersService.isPanelUser(reqId);
      if (!reqUser && reqId !== userId) {
        throw new HttpException(
          'You are not authorized to perform this action',
          HttpStatus.UNAUTHORIZED,
        );
      }
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

  async delete(userId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
