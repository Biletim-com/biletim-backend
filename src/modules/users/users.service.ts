import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FindOptionsRelations, ILike } from 'typeorm';

//services
import { PasswordService } from '@app/auth/services/password.service';

//types
import { UUID } from '@app/common/types';

//dtos
import { CreateUserDto } from './dto/create-user.dto';

//entities&repositories
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { Passenger } from '../passengers/passenger.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
  ) {}

  async getUsers(fullName?: string, offset = 0, limit = 10): Promise<User[]> {
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
      return totalUsers;
    } catch (err: any) {
      throw new HttpException(
        `user get error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: UUID): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
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
      const hashedPassword = this.passwordService.hashPassword(password);
      const user = await this.usersRepository.save(
        new User({
          name: name,
          familyName: familyName,
          email: email,
          password: hashedPassword,
          isVerified: true,
          passengers: [
            new Passenger({
              name,
              familyName,
              email,
            }),
          ],
        }),
      );
      return user;
    } catch (err: any) {
      throw new HttpException(
        `user create error ->  ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(userId: UUID, data: CreateUserDto): Promise<any> {
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

  async delete(userId: UUID) {
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

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({
      email,
    });
  }

  async findAppUserById(id: UUID, findOptions?: FindOptionsRelations<User>) {
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
