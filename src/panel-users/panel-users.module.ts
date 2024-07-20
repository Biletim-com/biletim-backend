import { Module, forwardRef } from '@nestjs/common';
import { PanelUsersService } from './panel-users.service';
import { PanelUsersController } from './panel-users.controller';
import { AuthModule } from '../auth/auth.module';
import { PasswordService } from '../auth/password/password.service';
import { UsersService } from '../users/users.service';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { PanelUser } from './panel-user.entity';
import { PanelUserRepository } from './panel-user.repository';

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
