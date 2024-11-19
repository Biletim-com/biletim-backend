import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TQueueConfiguration } from './config.types';

@Injectable()
export class QueueConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.QUEUE;

  constructor(private configService: ConfigService) {}

  get redisHost(): string {
    return this.configService.getOrThrow<TQueueConfiguration>(
      this.configurationNamespace,
    ).redisHost;
  }

  get redisPort(): string {
    return this.configService.getOrThrow<TQueueConfiguration>(
      this.configurationNamespace,
    ).redisPort;
  }

  get redisPassword(): string {
    return this.configService.getOrThrow<TQueueConfiguration>(
      this.configurationNamespace,
    ).redisPassword;
  }
}
