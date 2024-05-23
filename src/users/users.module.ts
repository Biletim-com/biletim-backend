import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { PasswordService } from 'src/auth/password/password.service';
import { PanelUsersService } from 'src/panel-users/panel-users.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, PasswordService, PanelUsersService],
  exports: [UsersService],
})
export class UsersModule {}
