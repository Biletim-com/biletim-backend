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

import ticketConfiguration, {
  TicketConfigService,
  TicketEnvVarsValidation,
} from './ticket';

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
  NetGsmEnvVarsValidation,
} from './netgsm';

import chromiumConfiguration, {
  ChromiumConfigService,
  ChromiumEnvVarsValidation,
} from './chromium';

import mongoConfiguration, {
  MongoConfigService,
  MongoEnvVarsValidation,
} from './database/mongodb';

@Global()
@Module({
  imports: [
    NestJsConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfiguration,
        authConfiguration,
        postgresqlConfiguration,
        ticketConfiguration,
        hotelApiConfiguration,
        superAdminConfiguration,
        loginWithGoogleConfiguration,
        loginWithFacebookConfiguration,
        notificationsConfiguration,
        paymentConfiguration,
        tamamliyoApiConfiguration,
        queueConfiguration,
        netGsmConfiguration,
        chromiumConfiguration,
        mongoConfiguration,
      ],
      validate: async (config) =>
        Promise.all([
          ConfigValidator.validate(AppEnvVarsValidation, config),
          ConfigValidator.validate(AuthEnvVarsValidation, config),
          ConfigValidator.validate(PostgreSQLEnvVarsValidation, config),
          ConfigValidator.validate(TicketEnvVarsValidation, config),
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
          ConfigValidator.validate(ChromiumEnvVarsValidation, config),
          ConfigValidator.validate(MongoEnvVarsValidation, config),
        ]),
    }),
  ],
  providers: [
    ConfigService,
    AppConfigService,
    AuthConfigService,
    PostgreSQLConfigService,
    TicketConfigService,
    HotelApiConfigService,
    SuperAdminConfigService,
    OAuthLoginWithGoogleConfigService,
    OAuthLoginWithFacebookConfigService,
    NotificationsConfigService,
    PaymentConfigService,
    TamamliyoApiConfigService,
    QueueConfigService,
    NetGsmConfigService,
    ChromiumConfigService,
    MongoConfigService,
  ],
  exports: [
    ConfigService,
    AppConfigService,
    AuthConfigService,
    PostgreSQLConfigService,
    TicketConfigService,
    HotelApiConfigService,
    SuperAdminConfigService,
    OAuthLoginWithGoogleConfigService,
    OAuthLoginWithFacebookConfigService,
    NotificationsConfigService,
    PaymentConfigService,
    TamamliyoApiConfigService,
    QueueConfigService,
    NetGsmConfigService,
    ChromiumConfigService,
    MongoConfigService,
  ],
})
export class ConfigModule {}
