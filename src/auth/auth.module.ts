import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { UsersModule } from '@app/modules/users/users.module';
import { PanelUsersModule } from '@app/modules/panel-users/panel-users.module';

// services
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { CookieService } from './services/cookie.service';

// strategies
import { JwtStrategy } from './strategies/jwt-auth.strategy';
import { LocalStrategy } from './strategies/local-auth.strategy';
import { PanelUserJwtStrategy } from './strategies/panel-user-jwt-auth.strategy';
import { PanelUserLocalStrategy } from './strategies/panel-user-local-auth.strategy';

import { TokenRefreshMiddleware } from './middlewares/token-refresh.middleware';
import { AuthConfigService } from '@app/configs/auth';

@Module({
  imports: [
    HttpModule,
    PanelUsersModule,
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (authAppConfigService: AuthConfigService) => ({
        secret: authAppConfigService.jwtSecret,
        signOptions: {
          expiresIn: `${authAppConfigService.jwtExpiration}s`,
        },
      }),
      inject: [AuthConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    CookieService,
    JwtStrategy,
    LocalStrategy,
    PanelUserJwtStrategy,
    PanelUserLocalStrategy,
  ],
  exports: [AuthService, PasswordService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenRefreshMiddleware).forRoutes('*');
  }
}
