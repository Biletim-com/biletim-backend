import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FindOptionsRelations, ILike } from 'typeorm';

import { AuthService } from '@app/auth/auth.service';
import { PasswordService } from '@app/auth/password/password.service';
import { UUIDv4 } from '@app/common/types';

import { PanelUsersService } from '../panel-users/panel-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => PasswordService))
    private passwordService: PasswordService,
    @Inject(forwardRef(() => PanelUsersService))
    private panelUsersService: PanelUsersService,
    private usersRepository: UsersRepository,
  ) {}

  async getUsers(
    fullName?: string,
    offset = 0,
    limit = 10,
  ): Promise<Omit<User, 'password'>[]> {
    try {
      const nameParts = fullName ? fullName.trim().split(' ') : [];
      const firstName = nameParts.length > 0 ? nameParts[0] : '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const whereCondition: any = {};

      if (firstName) {
        whereCondition.name = ILike(`%${firstName}%`);
      }

      if (lastName) {
        whereCondition.familyName = ILike(`%${lastName}%`);
      }

      const totalUsers = await this.usersRepository.find({
        skip: offset,
        take: limit,
        where: whereCondition,
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

  async findOne(id: UUIDv4): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    // TODO: do it in a DTO
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
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
      const user = await this.usersRepository.save(
        new User({
          name: name,
          familyName: familyName,
          email: email,
          password: hashedPassword,
          isVerified: true,
        }),
      );
      // TODO: do it in a DTO
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err: any) {
      throw new HttpException(
        `user create error ->  ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(
    reqId: any,
    userId: UUIDv4,
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

      await this.usersRepository.update(
        {
          id: userId,
        },
        {
          ...data,
        },
      );
      return { message: 'user updated', statusCode: 200 };
    } catch (err: any) {
      throw new HttpException(
        `user update error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(userId: UUIDv4) {
    try {
      const user = await this.usersRepository.findOneBy({
        id: userId,
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      await this.usersRepository.delete({
        id: userId,
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
    return this.usersRepository.findOneBy({
      email,
    });
  }

  async findAppUserById(id: UUIDv4, findOptions?: FindOptionsRelations<User>) {
    const appUser = await this.usersRepository.findOne({
      where: { id },
      relations: findOptions,
    });
    if (!appUser) {
      throw new NotFoundException(`User not found with this id`);
    }

    return appUser;
  }

  async getUserWithForgotPasswordCode(
    forgotPasswordCode: string,
  ): Promise<any> {
    const user = await this.usersRepository.findOneBy({
      forgotPasswordCode,
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${forgotPasswordCode} not found`,
      );
    }
    return user;
  }
}
