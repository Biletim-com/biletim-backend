import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { PasswordService } from '@app/auth/services/password.service';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';

import { Verification } from './verification/verification.entity';
import { VerificationsRepository } from './verification/verification.repository';

import { PanelUsersModule } from '../panel-users/panel-users.module';
import { PanelUsersService } from '../panel-users/panel-users.service';
import { VerificationService } from './verification/verification.service';

@Module({
  imports: [
    PanelUsersModule,
    PostgreSQLProviderModule.forFeature([User, Verification]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PasswordService,
    PanelUsersService,
    UsersRepository,
    VerificationsRepository,
    VerificationService,
  ],
  exports: [
    UsersService,
    UsersRepository,
    VerificationsRepository,
    VerificationService,
  ],
})
export class UsersModule {}
