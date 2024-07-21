import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '@app/auth/auth.module';
import { PasswordService } from '@app/auth/password/password.service';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { UsersService } from '../users/users.service';

import { PanelUser } from './panel-users.entity';
import { PanelUserRepository } from './panel-users.repository';
import { PanelUsersService } from './panel-users.service';
import { PanelUsersController } from './panel-users.controller';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PostgreSQLProviderModule.forFeature([PanelUser]),
  ],
  controllers: [PanelUsersController],
  providers: [
    PanelUsersService,
    PasswordService,
    UsersService,
    PanelUserRepository,
  ],
  exports: [PanelUsersService],
})
export class PanelUsersModule {}
