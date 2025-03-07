import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { PostgreSQLConfigService } from '@app/configs/database/postgresql';
import { PostgreSQLProviderService } from './provider.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
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
