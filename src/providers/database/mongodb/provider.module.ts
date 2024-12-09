import { Module } from '@nestjs/common';
import { MongoDBProviderService } from './provider.service';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoDBProviderService,
    }),
  ],
})
export class MongoProviderModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
