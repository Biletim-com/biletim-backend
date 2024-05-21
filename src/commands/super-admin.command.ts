import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CommandService } from './command.service';

@Injectable()
export class SuperAdminCommand {
  constructor(private readonly commandService: CommandService) {}

  @Command({
    command: 'create:super-admin <name> <familyName> <email> <password>',
    describe: 'create a super admin user',
  })
  async create(
    @Positional({
      name: 'name',
      describe: 'Name of the super admin',
      type: 'string',
    })
    firstName: string,
    @Positional({
      name: 'familyName',
      describe: 'familyName of the super admin',
      type: 'string',
    })
    lastName: string,
    @Positional({
      name: 'email',
      describe: 'Email of the super admin',
      type: 'string',
    })
    email: string,
    @Positional({
      name: 'password',
      describe: 'Password of the super admin',
      type: 'string',
    })
    password: string,
  ) {
    await this.commandService.createSuperAdmin(
      firstName,
      lastName,
      email,
      password,
    );
  }

  @Command({
    command: 'delete:super-admin <email>',
    describe: 'delete a super admin user by email',
  })
  async delete(
    @Positional({
      name: 'email',
      describe: 'Email of the super admin to delete',
      type: 'string',
    })
    email: string,
  ) {
    await this.commandService.deleteSuperAdmin(email);
  }
}
