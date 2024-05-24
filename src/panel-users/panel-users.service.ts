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
import { PasswordService } from 'src/auth/password/password.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class PanelUsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => PasswordService))
    private passwordService: PasswordService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  async createPanelAdmin(data: CreateUserDto, reqUserId: any): Promise<any> {
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

  async createSuperAdmin(){
    const user = await this.prisma.panelUser.create({
      data: {
        name: "SuperAdmin",
        familyName: "SuperAdmin",
        email: "superadmin@admin.com",
        password: await this.passwordService.hashPassword("$2b$10$8nqOXtecCiLwKO31ldNi.Ou/g4vYmnUMTvKhyJMwu9T4rPeDaTdn6"),
        isSUPER_ADMIN: true
      },
    });

    return user
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
}
