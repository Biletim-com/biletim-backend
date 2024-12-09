import { MongoConfigService } from '@app/configs/database/mongodb';
import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongoDBProviderService implements MongooseOptionsFactory {
  constructor(private readonly mongoDBConfigService: MongoConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.mongoDBConfigService.mongoURI,
      dbName: this.mongoDBConfigService.database,
    };
  }
}
