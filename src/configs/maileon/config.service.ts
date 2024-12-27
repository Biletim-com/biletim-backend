import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TMaileonConfiguration } from './config.types';

@Injectable()
export class MaileonConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.MAILEON;

  constructor(private configService: ConfigService) {}

  get maileonBaseURL(): string {
    return this.configService.getOrThrow<TMaileonConfiguration>(
      this.configurationNamespace,
    ).maileonBaseURL;
  }

  get maileonApiKey(): string {
    return this.configService.getOrThrow<TMaileonConfiguration>(
      this.configurationNamespace,
    ).maileonApiKey;
  }
}