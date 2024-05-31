import { Module } from '@nestjs/common';
import { AppleController } from '../apple/apple.controller';
import { AppleService } from '../apple/apple.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [JwtModule.register({}), UsersModule, AuthModule],
  controllers: [AppleController],
  providers: [AppleService],
})
export class AppleModule {}
