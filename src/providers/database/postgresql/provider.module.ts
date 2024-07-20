import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../../../configs/config.module';
import { PostgreSQLConfigService } from '../../../configs/database/postgresql/config.service';
import { PostgreSQLProviderService } from './provider.service';

import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: PostgreSQLProviderService,
      inject: [PostgreSQLConfigService],
    }),
  ],
})
export class PostgreSQLProviderModule {
  static forFeature(entities: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(entities);
  }
}
