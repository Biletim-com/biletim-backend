import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TBiletAllApiConfiguration } from './config.types';

@Injectable()
export class BiletAllApiConfigService {
  private readonly configurationNamespace =
    ConfigurationNamespaces.BILET_ALL_API;

  constructor(private configService: ConfigService) {}

  get biletAllApiBaseUrl(): string {
    return this.configService.getOrThrow<TBiletAllApiConfiguration>(
      this.configurationNamespace,
    ).biletAllApiBaseUrl;
  }

  get biletAllApiUsername(): string {
    return this.configService.getOrThrow<TBiletAllApiConfiguration>(
      this.configurationNamespace,
    ).biletAllApiUsername;
  }

  get biletAllApiPassword(): string {
    return this.configService.getOrThrow<TBiletAllApiConfiguration>(
      this.configurationNamespace,
    ).biletAllApiPassword;
  }
}
