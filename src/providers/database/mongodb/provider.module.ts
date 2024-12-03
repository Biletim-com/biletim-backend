import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoProviderService } from './provider.service';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { MongoConfigService } from '@app/configs/database/mongodb';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: MongoProviderService,
      inject: [MongoConfigService],
    }),
  ],
  providers: [MongoConfigService, MongoProviderService],
})
export class MongoProviderModule {
  static forFeature(entities: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(entities);
  }
}
