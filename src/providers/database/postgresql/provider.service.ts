import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { PostgreSQLConfigService } from '../../../configs/database/postgresql/config.service';

@Injectable()
export class PostgreSQLProviderService implements TypeOrmOptionsFactory {
  constructor(private postgreSQLConfigService: PostgreSQLConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.postgreSQLConfigService.host,
      port: this.postgreSQLConfigService.port,
      username: this.postgreSQLConfigService.user,
      password: this.postgreSQLConfigService.password,
      database: this.postgreSQLConfigService.database,
      autoLoadEntities: true,
      synchronize: false,
      logging: this.postgreSQLConfigService.logging,
      migrations: [`${__dirname}/../../../database/migrations/*{.ts,.js}`],
      migrationsRun: true,
      entities: [`${__dirname}/../../../modules/**/*.entity{.ts,.js}`],
    };
  }
}
