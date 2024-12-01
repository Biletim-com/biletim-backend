import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TChromiumConfiguration } from './config.types';

@Injectable()
export class ChromiumConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.CHROMIUM;

  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.getOrThrow<TChromiumConfiguration>(
      this.configurationNamespace,
    ).host;
  }

  get port(): string {
    return this.configService.getOrThrow<TChromiumConfiguration>(
      this.configurationNamespace,
    ).port;
  }
}
