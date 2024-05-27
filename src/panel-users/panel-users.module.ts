import { Module, forwardRef } from '@nestjs/common';
import { PanelUsersService } from './panel-users.service';
import { PanelUsersController } from './panel-users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PasswordService } from 'src/auth/password/password.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [PanelUsersController],
  providers: [PanelUsersService, PasswordService, UsersService],
  exports: [PanelUsersService],
})
export class PanelUsersModule {}
