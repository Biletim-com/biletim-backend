import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ILike } from 'typeorm';

import { PasswordService } from '@app/auth/services/password.service';
import { SuperAdminConfigService } from '@app/configs/super-admin/config.service';
import { UUID } from '@app/common/types';

import { CreatePanelUserDto } from './dto/create-panel-user.dto';
import { PanelUsersRepository } from './panel-users.repository';
import { PanelUser } from './panel-user.entity';
import { PanelUserWithoutPasswordDto } from './dto/panel-user-without-password.dto';

@Injectable()
export class PanelUsersService {
  constructor(
    private passwordService: PasswordService,
    private superAdminConfigService: SuperAdminConfigService,
    private panelUsersRepository: PanelUsersRepository,
  ) {}

  async getUsers(
    fullName?: string,
    offset = 0,
    limit = 10,
  ): Promise<PanelUserWithoutPasswordDto[]> {
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

      const totalUsers = await this.panelUsersRepository.find({
        skip: offset,
        take: limit,
        where: whereCondition,
      });

      return totalUsers.map((user) => new PanelUserWithoutPasswordDto(user));
    } catch (err: any) {
      throw new HttpException(
        `user get error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: UUID): Promise<PanelUserWithoutPasswordDto> {
    const user = await this.panelUsersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    return new PanelUserWithoutPasswordDto(user);
  }

  async createSuperAdmin(key: string): Promise<any> {
    const { superAdminEmail, superAdminPassword, superAdminKey } =
      this.superAdminConfigService;

    if (key !== superAdminKey)
      throw new HttpException('key is not correct', HttpStatus.BAD_REQUEST);

    const existUser = await this.panelUsersRepository.findOneBy({
      email: superAdminEmail,
      isSuperAdmin: true,
    });
    if (existUser) {
      throw new HttpException('super admin already exist', HttpStatus.CONFLICT);
    }

    try {
      await this.panelUsersRepository.save(
        new PanelUser({
          name: 'SUPER',
          familyName: 'ADMIN',
          email: superAdminEmail,
          password: this.passwordService.hashPassword(superAdminPassword),
          isSuperAdmin: true,
        }),
      );
      return { message: 'Super admin created', statusCode: '201' };
    } catch (err: any) {
      throw new HttpException(
        `Super Admin create error -> ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteAdmin(id: UUID, req: any): Promise<any> {
    try {
      const ReqUser = await this.findPanelUserByEmail(req.email);
      if (!ReqUser)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      if (!ReqUser.isSuperAdmin) {
        throw new HttpException(
          'You are not authorized to perform this action',
          HttpStatus.FORBIDDEN,
        );
      }
      const user = await this.findPanelUserById(id);

      if (!user)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      await this.panelUsersRepository.delete({ id });
      return { message: 'user deleted', statusCode: '200' };
    } catch (err: any) {
      throw new HttpException(
        `Super Admin delete error -> ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPanelAdmin(
    data: CreatePanelUserDto,
  ): Promise<PanelUserWithoutPasswordDto> {
    try {
      const { name, familyName, email, password } = data;

      const existUser = await this.panelUsersRepository.findOneBy({
        email,
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

      const user = await this.panelUsersRepository.save(
        new PanelUser({
          name: name,
          familyName: familyName,
          email: email,
          password: await this.passwordService.hashPassword(password),
        }),
      );

      return new PanelUserWithoutPasswordDto(user);
    } catch (err: any) {
      throw new HttpException(
        `Bad Request. Please check the payload -> ${err?.message} `,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(userId: UUID, data: CreatePanelUserDto): Promise<any> {
    try {
      const { email } = data;
      const user = await this.findPanelUserById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
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

      await this.panelUsersRepository.update(
        { id: userId },
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

  async delete(userId: UUID): Promise<any> {
    try {
      const user = await this.panelUsersRepository.findOneBy({
        id: userId,
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      await this.panelUsersRepository.delete({
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

  async panelChangePassword(
    userId: UUID,
    oldPassword: string,
    newPassword: string,
  ) {
    let user: any;
    try {
      user = await this.findPanelUserById(userId);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid = await this.passwordService.validatePassword(
        oldPassword,
        user.password,
      );

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

      const newPasswordHash = this.passwordService.hashPassword(newPassword);

      await this.panelUsersRepository.update(
        { id: user.id },
        { password: newPasswordHash },
      );
      return { message: 'your password changed', statusCode: 200 };
    } catch (err: any) {
      throw new HttpException(
        `change password error -> ${err?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findPanelUserByEmail(email: string) {
    return this.panelUsersRepository.findOneBy({ email });
  }
  async findPanelUserById(id: UUID) {
    const panelUser = await this.panelUsersRepository.findOneBy({
      id,
    });
    if (!panelUser) {
      throw new NotFoundException(`Panel User not found with this id`);
    }

    return panelUser;
  }

  async isPanelUser(userId: UUID): Promise<boolean> {
    const panelUser = await this.panelUsersRepository.findOneBy({
      id: userId,
    });
    return !!panelUser;
  }
}
