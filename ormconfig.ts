import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppModule } from './src/app.module';
import { PostgreSQLProviderService } from './src/providers/database/postgresql/provider.service';

export default (async () => {
  const app = await NestFactory.create(AppModule);

  const postgresDataSource = app
    .get(PostgreSQLProviderService)
    .createTypeOrmOptions();

  return new DataSource(postgresDataSource);
})();
