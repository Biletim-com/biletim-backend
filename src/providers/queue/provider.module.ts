import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueProviderService } from './provider.service';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useClass: QueueProviderService,
      inject: [QueueProviderService],
    }),
  ],
})

export class QueueProviderModule {}
