import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { PasswordService } from '@app/auth/services/password.service';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';


import { PanelUsersModule } from '../panel-users/panel-users.module';
import { PanelUsersService } from '../panel-users/panel-users.service';

@Module({
  imports: [
    PanelUsersModule,
    PostgreSQLProviderModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PasswordService,
    PanelUsersService,
    UsersRepository
  ],
  exports: [
    UsersService,
    UsersRepository
  ],
})
export class UsersModule {}
