import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommandService {
  constructor(private readonly prisma: PrismaService) {}

  async createSuperAdmin(
    name: string,
    familyName: string,
    email: string,
    password: string,
  ): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.panelUser.create({
      data: {
        name,
        familyName,
        email,
        password: hashedPassword,
        isSUPER_ADMIN: true,
      },
    });

    return 'Super admin created successfully';
  }

  async deleteSuperAdmin(email: string): Promise<any> {
    const user = await this.prisma.panelUser.findUnique({
      where: { email },
    });

    if (!user || !user.isSUPER_ADMIN) {
      console.log('Super admin not found');
      return;
    }

    await this.prisma.panelUser.delete({
      where: { email },
    });

    return 'Super admin deleted successfully';
  }
}
