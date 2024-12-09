import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TPaymentConfiguration } from './config.types';

@Injectable()
export class PaymentConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.PAYMENT;

  constructor(private configService: ConfigService) {}

  get vakifBankVPosBaseUrl(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).vakifBankVPosBaseUrl;
  }

  get vakifBank3DSBaseUrl(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).vakifBank3DSBaseUrl;
  }

  get vakifBankMerchantId(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).vakifBankMerchantId;
  }

  get vakifBankMerchantPassword(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).vakifBankMerchantPassword;
  }

  get vakifBankTerminalNumber(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).vakifBankTerminalNumber;
  }

  get biletAll3DSBaseUrl(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).biletAll3DSBaseUrl;
  }

  get biletAll3DSUsername(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).biletAll3DSUsername;
  }

  get biletAll3DSPassword(): string {
    return this.configService.getOrThrow<TPaymentConfiguration>(
      this.configurationNamespace,
    ).biletAll3DSPassword;
  }
}
