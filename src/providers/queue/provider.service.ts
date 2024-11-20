import { Injectable } from '@nestjs/common';
import { BullModuleOptions, BullOptionsFactory } from '@nestjs/bull';
import { QueueConfigService } from '@app/configs/queue';

@Injectable()
export class QueueProviderService implements BullOptionsFactory {
  constructor(private readonly queueConfigService: QueueConfigService) {}

  createBullOptions(): BullModuleOptions {
    return {
      redis: {
        host: this.queueConfigService.redisHost,
        port: Number(this.queueConfigService.redisPort),
        password: this.queueConfigService.redisPassword,
      },
    };
  }
}