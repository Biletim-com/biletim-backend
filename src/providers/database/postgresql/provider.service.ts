import { Injectable } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { PostgreSQLConfigService } from '@app/configs/database/postgresql';

// entities
import { User } from '@app/modules/users/user.entity';
import { PanelUser } from '@app/modules/panel-users/panel-user.entity';
import { Verification } from '@app/modules/users/verification/verification.entity';
import { BusTerminal } from '@app/modules/tickets/bus/entities/bus-terminal.entity';
import { Airport } from '@app/modules/tickets/plane/entities/airport.entity';

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
      migrations: [`${__dirname}/../../../database/migrations/*{.ts,.js}`],
      migrationsRun: true,
      entities: [User, PanelUser, Verification, BusTerminal, Airport],
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
