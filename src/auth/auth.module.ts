import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@app/modules/users/users.module';
import { PanelUsersModule } from '@app/modules/panel-users/panel-users.module';

// services
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { CookieService } from './services/cookie.service';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { OAuth2StrategyFactory } from './factories/oauth2-strategy.factory';

// strategies
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { LocalStrategy } from './strategies/local-auth.strategy';
import { PanelUserJwtAuthStrategy } from './strategies/panel-user-jwt-auth.strategy';
import { PanelUserLocalStrategy } from './strategies/panel-user-local-auth.strategy';
import { GoogleOAuth2Strategy } from './strategies/google-auth2.strategy';
import { FacebookOAuth2Strategy } from './strategies/facebook-auth2.strategy';

import { TokenRefreshMiddleware } from './middlewares/token-refresh.middleware';

import { AuthConfigService } from '@app/configs/auth';
import { OAuthLoginWithFacebookConfigService } from '@app/configs/oauth-facebook';
import { OAuthLoginWithGoogleConfigService } from '@app/configs/oauth-google';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';

@Module({
  imports: [
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
    JwtAuthStrategy,
    LocalStrategy,
    PanelUserJwtAuthStrategy,
    PanelUserLocalStrategy,
    GoogleOAuth2Strategy,
    FacebookOAuth2Strategy,
    OAuth2StrategyFactory,
    RestClientService,
    OAuthLoginWithGoogleConfigService,
    OAuthLoginWithFacebookConfigService,
    EventEmitterService,
  ],
  exports: [AuthService, PasswordService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenRefreshMiddleware).forRoutes('*');
  }
}
