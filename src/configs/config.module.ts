import { Module } from '@nestjs/common';
import {
  ConfigModule as NestJsConfigModule,
  ConfigService,
} from '@nestjs/config';

import appConfiguration from './app/configuration';
import postgresqlConfiguration from './database/postgresql/configuration';
import { ConfigValidator } from './config.validator';

import { AppConfigService } from './app/config.service';
import { AppEnvVarsValidation } from './app/config.validator';

import { PostgreSQLConfigService } from './database/postgresql/config.service';
import { PostgreSQLEnvVarsValidation } from './database/postgresql/config.validator';

@Module({
  imports: [
    NestJsConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration, postgresqlConfiguration],
      validate: async (config) =>
        Promise.all([
          ConfigValidator.validate(AppEnvVarsValidation, config),
          ConfigValidator.validate(PostgreSQLEnvVarsValidation, config),
        ]),
    }),
  ],
  providers: [ConfigService, AppConfigService, PostgreSQLConfigService],
  exports: [ConfigService, AppConfigService, PostgreSQLConfigService],
})
export class ConfigModule {}
