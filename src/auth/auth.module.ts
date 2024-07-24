import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { UsersModule } from '@app/modules/users/users.module';
import { PanelUsersModule } from '@app/modules/panel-users/panel-users.module';

import { AuthGuard } from './auth.guard';
import { AUTH_STRATEGY_TOKEN } from './auth.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password/password.service';
// import { AppleStrategy } from '../apple/apple.strategy';

@Module({
  imports: [
    HttpModule,
    PanelUsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    AuthGuard,
    {
      provide: AUTH_STRATEGY_TOKEN,
      useClass: JwtStrategy,
    },
    // AppleStrategy,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
