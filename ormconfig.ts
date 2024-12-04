/// <reference path="./global.d.ts" />
import * as dotenv from'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ConfigModule } from '@app/configs/config.module';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { PostgreSQLProviderService } from '@app/providers/database/postgresql/provider.service';

@Module({
  imports: [ConfigModule, PostgreSQLProviderModule],
})
class PostgreSQLDataSourceModule {}

export default (async () => {
  const postgreSQLApp = await NestFactory.create(PostgreSQLDataSourceModule);

  const postgresDataSource = postgreSQLApp
    .get(PostgreSQLProviderService)
    .createTypeOrmOptions();

  return new DataSource(postgresDataSource);
})();
