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

import notificationsConfiguration, {
  NotificationsConfigService,
  NotificationsEnvVarsValidation,
} from './notifications';

import tamamliyoApiConfiguration, {
  TamamliyoApiConfigService,
  TamamliyoApiEnvVarsValidation,
} from './tamamliyo-insurance';

import paymentConfiguration, {
  PaymentConfigService,
  PaymentEnvVarsValidation,
} from './payment';

import queueConfiguration, {
  QueueConfigService,
  QueueEnvVarsValidation,
} from './queue';

import netGsmConfiguration, { 
  NetGsmConfigService, 
  NetGsmEnvVarsValidation 
} from './netgsm';

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
        notificationsConfiguration,
        paymentConfiguration,
        tamamliyoApiConfiguration,
        queueConfiguration,
        netGsmConfiguration
      ],
      validate: async (config) =>
        Promise.all([
          ConfigValidator.validate(AppEnvVarsValidation, config),
          ConfigValidator.validate(AuthEnvVarsValidation, config),
          ConfigValidator.validate(PostgreSQLEnvVarsValidation, config),
          ConfigValidator.validate(BiletAllApiEnvVarsValidation, config),
          ConfigValidator.validate(HotelApiEnvVarsValidation, config),
          ConfigValidator.validate(SuperAdminEnvVarsValidation, config),
          ConfigValidator.validate(NotificationsEnvVarsValidation, config),
          ConfigValidator.validate(QueueEnvVarsValidation, config),
          ConfigValidator.validate(NetGsmEnvVarsValidation, config),
          ConfigValidator.validate(
            OAuthLoginWithGoogleEnvVarsValidation,
            config,
          ),
          ConfigValidator.validate(
            OAuthLoginWithFacebookEnvVarsValidation,
            config,
          ),
          ConfigValidator.validate(PaymentEnvVarsValidation, config),
          ConfigValidator.validate(TamamliyoApiEnvVarsValidation, config),
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
    NotificationsConfigService,
    PaymentConfigService,
    TamamliyoApiConfigService,
    QueueConfigService,
    NetGsmConfigService
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
    NotificationsConfigService,
    PaymentConfigService,
    TamamliyoApiConfigService,
    QueueConfigService,
    NetGsmConfigService
  ],
})
export class ConfigModule {}
