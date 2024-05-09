import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password/password.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'nestjs-prisma';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from './auth.guard';
import { AUTH_STRATEGY_TOKEN } from './auth.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
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
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
