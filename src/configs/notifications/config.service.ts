import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TNotificationsConfiguration } from './config.types';

@Injectable()
export class NotificationsConfigService {
  private readonly configurationNamespace =
    ConfigurationNamespaces.NOTIFICATIONS;

  constructor(private readonly configService: ConfigService) {}

  get emailHost(): string {
    return this.configService.getOrThrow<TNotificationsConfiguration>(
      this.configurationNamespace,
    ).emailHost;
  }

  get emailPort(): number {
    return this.configService.getOrThrow<TNotificationsConfiguration>(
      this.configurationNamespace,
    ).emailPort;
  }

  get emailUsername(): string {
    return this.configService.getOrThrow<TNotificationsConfiguration>(
      this.configurationNamespace,
    ).emailUsername;
  }

  get emailPassword(): string {
    return this.configService.getOrThrow<TNotificationsConfiguration>(
      this.configurationNamespace,
    ).emailPassword;
  }

  get emailUseSSL(): boolean {
    return this.configService.getOrThrow<TNotificationsConfiguration>(
      this.configurationNamespace,
    ).emailUseSSL;
  }

  get emailFrom(): string {
    return this.configService.getOrThrow<TNotificationsConfiguration>(
      this.configurationNamespace,
    ).emailFrom;
  }
}
