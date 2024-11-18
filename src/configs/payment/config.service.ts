import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TPaymentConfiguration } from './config.types';

@Injectable()
export class PaymentConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.PAYMENT;

  constructor(private configService: ConfigService) {}

  get vPosBaseUrl(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).vPosBaseUrl;
  }

  get threeDSecureBaseUrl(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).threeDSecureBaseUrl;
  }

  get merchantId(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).merchantId;
  }

  get merchantPassword(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).merchantPassword;
  }

  get terminalNo(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).terminalNo;
  }
}
