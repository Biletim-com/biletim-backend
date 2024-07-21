import { forwardRef, Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PasswordService } from '../auth/password/password.service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Verification } from './verification/verification.entity';
import { AuthModule } from '../auth/auth.module';
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
