import { forwardRef, Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { AuthModule } from '@app/auth/auth.module';
import { PasswordService } from '@app/auth/password/password.service';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { UserRepository } from './users.repository';
import { Verification } from './verification/verification.entity';
import { PanelUsersService } from '../panel-users/panel-users.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PostgreSQLProviderModule.forFeature([User, Verification]),
  ],
  controllers: [UsersController],
  providers: [UsersService, PasswordService, PanelUsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
