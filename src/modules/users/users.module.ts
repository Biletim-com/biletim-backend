import { forwardRef, Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { AuthModule } from '@app/auth/auth.module';
import { PasswordService } from '@app/auth/password/password.service';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';

import { Verification } from './verification/verification.entity';
import { VerificationsRepository } from './verification/verification.repository';

import { PanelUsersModule } from '../panel-users/panel-users.module';
import { PanelUsersService } from '../panel-users/panel-users.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PostgreSQLProviderModule.forFeature([User, Verification]),
    PanelUsersModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PasswordService,
    PanelUsersService,
    UsersRepository,
    VerificationsRepository,
  ],
  exports: [UsersService, UsersRepository, VerificationsRepository],
})
export class UsersModule {}
