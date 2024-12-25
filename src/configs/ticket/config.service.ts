import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TTicketConfiguration } from './config.types';

@Injectable()
export class TicketConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.TICKET;

  constructor(private configService: ConfigService) {}

  get biletAllBaseUrl(): string {
    return this.configService.getOrThrow<TTicketConfiguration>(
      this.configurationNamespace,
    ).biletAllBaseUrl;
  }

  get biletAllUsername(): string {
    return this.configService.getOrThrow<TTicketConfiguration>(
      this.configurationNamespace,
    ).biletAllUsername;
  }

  get biletAllPassword(): string {
    return this.configService.getOrThrow<TTicketConfiguration>(
      this.configurationNamespace,
    ).biletAllPassword;
  }
}
