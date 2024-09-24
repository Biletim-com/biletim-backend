import { Module } from '@nestjs/common';

import { PasswordService } from '@app/auth/services/password.service';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { SuperAdminConfigService } from '@app/configs/super-admin';

import { UsersService } from '../users/users.service';

import { PanelUser } from './panel-user.entity';
import { PanelUsersRepository } from './panel-users.repository';
import { PanelUsersService } from './panel-users.service';
import { PanelUsersController } from './panel-users.controller';
import { UsersRepository } from '../users/users.repository';
import { VerificationsRepository } from '../users/verification/verification.repository';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([PanelUser])],
  controllers: [PanelUsersController],
  providers: [
    PanelUsersService,
    PasswordService,
    UsersService,
    UsersRepository,
    VerificationsRepository,
    PanelUsersRepository,
    SuperAdminConfigService,
  ],
  exports: [PanelUsersService, PanelUsersRepository],
})
export class PanelUsersModule {}
