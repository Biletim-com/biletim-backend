import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@app/modules/users/users.module';
import { AuthModule } from '@app/auth/auth.module';

import { AppleController } from '../apple/apple.controller';
import { AppleService } from '../apple/apple.service';

@Module({
  imports: [JwtModule.register({}), UsersModule, AuthModule],
  controllers: [AppleController],
  providers: [AppleService],
})
export class AppleModule {}
