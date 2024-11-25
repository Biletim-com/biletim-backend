import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TNetGsmConfiguration } from './config.types';

@Injectable()
export class NetGsmConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.NETGSM;

  constructor(private configService: ConfigService) {}

  get netGsmBaseURL(): string {
    return this.configService.getOrThrow<TNetGsmConfiguration>(
      this.configurationNamespace,
    ).netGsmBaseURL;
  }

  get netGsmUsername(): string {
    return this.configService.getOrThrow<TNetGsmConfiguration>(
      this.configurationNamespace,
    ).netGsmUsername;
  }

  get netGsmPassword(): string {
    return this.configService.getOrThrow<TNetGsmConfiguration>(
      this.configurationNamespace,
    ).netGsmPassword;
  }

  get netGsmAppKey(): string {
    return this.configService.getOrThrow<TNetGsmConfiguration>(
      this.configurationNamespace,
    ).netGsmAppKey;
  }
}
