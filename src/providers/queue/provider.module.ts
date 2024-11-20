import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueConfigService } from '@app/configs/queue';
import { QueueProviderService } from './provider.service';
import { EmailProcessor } from '@app/notifications/strategies/email-notification.strategy';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [QueueProviderService],
      useFactory: (queueProviderService: QueueProviderService) =>
        queueProviderService.createBullOptions(),
    }),
    BullModule.registerQueue({
      name: 'emailQueue',
    }),
  ],
  providers: [QueueProviderService, QueueConfigService, EmailProcessor],
})
export class AppModule {}
