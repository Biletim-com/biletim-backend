import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: any, user: any) {
    const role = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        role: true,
      },
    });
    if (role.role.name !== 'admin') {
      throw new HttpException('Unauthorized', 401);
    }

    return this.prisma.user.create({
      data: createUserDto,
    });
  }
  async findAll(reqUser: any) {
    const sysUser = await this.prisma.user.findUnique({
      include: {
        role: true,
        company: true,
      },
      where: {
        id: reqUser.id,
      },
    });

    if (sysUser.role.name == 'admin') {
      return this.prisma.user.findMany();
    } else {
      return this.prisma.user.findMany({
        where: {
          company_id: sysUser.company.id,
        },
      });
    }
  }
  async findOne(user: any, id: string) {
    const userFound = await this.prisma.user.findUnique({
      include: {
        role: true,
        company: true,
      },
      where: {
        id: id,
      },
    });
    if (!userFound) {
      throw new HttpException('User not found', 404);
    }
    if (
      userFound.role.name !== 'admin' &&
      userFound.company_id !== user.company_id
    ) {
      throw new HttpException('Unauthorized', 401);
    }
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        role: true,
        company: true,
      },
    });
  }

  async update(user: any, id: string, data: any) {
    const userFound = await this.prisma.user.findUnique({
      include: {
        role: true,
        company: true,
      },
      where: {
        id: id,
      },
    });
    if (!userFound) {
      throw new HttpException('User not found', 404);
    }
    if (
      userFound.role.name !== 'admin' &&
      userFound.company_id !== user.company_id
    ) {
      throw new HttpException('Unauthorized', 401);
    }
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });
  }
  async remove(user: any, id: string) {
    const userFound = await this.prisma.user.findUnique({
      include: {
        role: true,
        company: true,
      },
      where: {
        id: id,
      },
    });
    if (!userFound) {
      throw new HttpException('User not found', 404);
    }
    if (
      userFound.role.name !== 'ADMIN' &&
      userFound.company_id !== user.company_id
    ) {
      throw new HttpException('Unauthorized', 401);
    }
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
  async me(user: any) {
    return this.prisma.user.findUnique({
      include: {
        role: true,
        company: true,
      },
      where: {
        id: user.id,
      },
    });
  }
}
