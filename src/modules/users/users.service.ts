import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FindOptionsRelations, FindOptionsWhere, ILike } from 'typeorm';

//services
import { PasswordService } from '@app/auth/services/password.service';

//types
import { UUID } from '@app/common/types';

//dtos
import { CreateUserDto } from './dto/create-user.dto';

//entities&repositories
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { Verification } from '../verification/verification.entity';
import { ServiceError, UserNotFoundError } from '@app/common/errors';
import { Wallet } from '../wallets/wallet.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
  ) {}

  async getUsers(fullName?: string, offset = 0, limit = 10): Promise<User[]> {
    const nameParts = fullName ? fullName.trim().split(' ') : [];
    const firstName = nameParts.length > 0 ? nameParts[0] : '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const whereCondition: FindOptionsWhere<User> = {};

    if (firstName) {
      whereCondition.name = ILike(`%${firstName}%`);
    }

    if (lastName) {
      whereCondition.familyName = ILike(`%${lastName}%`);
    }

    return this.usersRepository.find({
      skip: offset,
      take: limit,
      where: whereCondition,
    });
  }

  async findOne(id: UUID): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, name, familyName, isVerified } = createUserDto;

    const email = createUserDto.email.toLowerCase();
    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new ServiceError('This email address is already in use');
    }
    const hashedPassword = this.passwordService.hashPassword(password);
    return this.usersRepository.save(
      new User({
        name,
        familyName,
        email,
        password: hashedPassword,
        isVerified,
        wallet: new Wallet({
          balance: 0,
        }),
      }),
    );
  }

  async updateUser(userId: UUID, data: CreateUserDto): Promise<any> {
    try {
      const { email } = data;
      const user = await this.findAppUserById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      // validate password at dto or delete this
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      // typeorm ignore this ?? check
      if (user.isDeleted)
        throw new HttpException(
          'user not active, please contact your super admin',
          HttpStatus.NOT_FOUND,
        );
      const existingUser = await this.findByEmail(email);
      if (!existingUser) {
        throw new UserNotFoundError();
      }

      // validate func
      if (existingUser && user.email !== existingUser.email)
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

  async updateVerificationStatus(
    userId: UUID,
    verificationId: UUID,
  ): Promise<User> {
    return await this.usersRepository.save(
      new User({
        id: userId,
        isVerified: true,
        verification: [
          new Verification({
            id: verificationId,
            isUsed: true,
          }),
        ],
      }),
    );
  }

  async delete(userId: UUID): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const deleteResult = await this.usersRepository.delete({
      id: userId,
    });
    return !!deleteResult.affected;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
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

  async updateUserPasswordCode(
    email: string,
    forgotPasswordCode: string,
  ): Promise<void> {
    await this.usersRepository.update(
      { email },
      { forgotPasswordCode, isUsed: false },
    );
  }

  async updateUserPassword(
    email: string,
    password: string,
    updateOptions: boolean = true,
  ): Promise<void> {
    const updateData: any = { password };

    if (updateOptions) {
      updateData.forgotPasswordCode = null;
      updateData.isUsed = true;
    }

    await this.usersRepository.update({ email }, updateData);
  }
}
