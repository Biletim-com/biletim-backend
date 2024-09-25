import { Global, Module } from '@nestjs/common';
import {
  ConfigModule as NestJsConfigModule,
  ConfigService,
} from '@nestjs/config';

import { ConfigValidator } from './config.validator';

import appConfiguration, {
  AppConfigService,
  AppEnvVarsValidation,
} from './app';

import authConfiguration, {
  AuthConfigService,
  AuthEnvVarsValidation,
} from './auth';

import postgresqlConfiguration, {
  PostgreSQLConfigService,
  PostgreSQLEnvVarsValidation,
} from './database/postgresql';

import biletAllApiConfiguration, {
  BiletAllApiConfigService,
  BiletAllApiEnvVarsValidation,
} from './bilet-all-api';

import hotelApiConfiguration, {
  HotelApiConfigService,
  HotelApiEnvVarsValidation,
} from './hotel-api';

import superAdminConfiguration, {
  SuperAdminConfigService,
  SuperAdminEnvVarsValidation,
} from './super-admin';

import loginWithGoogleConfiguration, {
  OAuthLoginWithGoogleConfigService,
  OAuthLoginWithGoogleEnvVarsValidation,
} from './oauth-google';

import loginWithFacebookConfiguration, {
  OAuthLoginWithFacebookConfigService,
  OAuthLoginWithFacebookEnvVarsValidation,
} from './oauth-facebook';

@Global()
@Module({
  imports: [
    NestJsConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfiguration,
        authConfiguration,
        postgresqlConfiguration,
        biletAllApiConfiguration,
        hotelApiConfiguration,
        superAdminConfiguration,
        loginWithGoogleConfiguration,
        loginWithFacebookConfiguration,
      ],
      validate: async (config) =>
        Promise.all([
          ConfigValidator.validate(AppEnvVarsValidation, config),
          ConfigValidator.validate(AuthEnvVarsValidation, config),
          ConfigValidator.validate(PostgreSQLEnvVarsValidation, config),
          ConfigValidator.validate(BiletAllApiEnvVarsValidation, config),
          ConfigValidator.validate(HotelApiEnvVarsValidation, config),
          ConfigValidator.validate(SuperAdminEnvVarsValidation, config),
          ConfigValidator.validate(
            OAuthLoginWithGoogleEnvVarsValidation,
            config,
          ),
          ConfigValidator.validate(
            OAuthLoginWithFacebookEnvVarsValidation,
            config,
          ),
        ]),
    }),
  ],
  providers: [
    ConfigService,
    AppConfigService,
    AuthConfigService,
    PostgreSQLConfigService,
    BiletAllApiConfigService,
    HotelApiConfigService,
    SuperAdminConfigService,
    OAuthLoginWithGoogleConfigService,
    OAuthLoginWithFacebookConfigService,
  ],
  exports: [
    ConfigService,
    AppConfigService,
    AuthConfigService,
    PostgreSQLConfigService,
    BiletAllApiConfigService,
    HotelApiConfigService,
    SuperAdminConfigService,
    OAuthLoginWithGoogleConfigService,
    OAuthLoginWithFacebookConfigService,
  ],
})
export class ConfigModule {}
