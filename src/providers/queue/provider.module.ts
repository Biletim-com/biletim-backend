import { Module, Global, DynamicModule } from '@nestjs/common';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { QueueConfigService } from '@app/configs/queue';
import { QueueProviderService } from './provider.service';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [QueueProviderService],
      useFactory: (queueProviderService: QueueProviderService) => queueProviderService.createBullOptions(),
    }),
  ],
  providers: [QueueProviderService, QueueConfigService],
  exports: [QueueProviderService, QueueConfigService],
})
export class QueueProviderModule {
  static registerQueue(options: BullModuleOptions[]): DynamicModule{
    return BullModule.registerQueue(...options)
  }
}