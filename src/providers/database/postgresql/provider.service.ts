import { Injectable } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { PostgreSQLConfigService } from '@app/configs/database/postgresql';

@Injectable()
export class PostgreSQLProviderService implements TypeOrmOptionsFactory {
  constructor(private postgreSQLConfigService: PostgreSQLConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions & DataSourceOptions {
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
      migrations: [`${__dirname}/./migrations/*{.ts,.js}`],
      migrationsRun: true,
      entities: [`${__dirname}/../../../modules/**/*.entity{.ts,.js}`],
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
