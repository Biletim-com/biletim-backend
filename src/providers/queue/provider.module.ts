import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueProviderService } from './provider.service';
import { QueueConfigService } from '@app/configs/queue'; 

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useClass: QueueProviderService,
    }),
    BullModule.registerQueue({
      name: 'queue',
    }),
  ],
  providers: [QueueProviderService, QueueConfigService],
})

export class QueueProviderModule {}
