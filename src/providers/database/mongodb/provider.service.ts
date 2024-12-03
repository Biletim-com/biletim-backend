import { MongoConfigService } from '@app/configs/database/mongodb/config.service';
import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Injectable()
export class MongoProviderService implements TypeOrmOptionsFactory {
  constructor(private readonly mongoDBConfigService: MongoConfigService) {}

  public createTypeOrmOptions(): DataSourceOptions {
    return {
      type: 'mongodb',
      url: this.mongoDBConfigService.mongoURI,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      synchronize: false,
      logging: this.mongoDBConfigService.logging,
      entities: [`${__dirname}/../../../modules/**/*.entity{.ts,.js}`],
      migrations: [`${__dirname}/./migrations/*{.ts,.js}`],
    };
  }
}
