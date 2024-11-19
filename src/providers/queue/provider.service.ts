import { Injectable } from '@nestjs/common';
import { SharedBullConfigurationFactory, BullRootModuleOptions } from '@nestjs/bullmq';
import { QueueConfigService } from '@app/configs/queue';

@Injectable()
export class QueueProviderService implements SharedBullConfigurationFactory {
  constructor(private readonly queueConfigService: QueueConfigService) {}

  createSharedConfiguration(): BullRootModuleOptions {
    return {
      connection: {
        host: this.queueConfigService.redisHost,
        port: Number(this.queueConfigService.redisPort),
        password: this.queueConfigService.redisPassword,
      },
    };
  }
}