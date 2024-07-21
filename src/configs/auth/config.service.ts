import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TAuthConfiguration } from './config.types';

@Injectable()
export class AuthConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.AUTH;

  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<TAuthConfiguration>(
      this.configurationNamespace,
    ).jwtSecret;
  }

  get bcryptSaltRounds(): number {
    return this.configService.get<TAuthConfiguration>(
      this.configurationNamespace,
    ).bcryptSaltRounds;
  }

  get resetPasswordUrl(): string {
    return this.configService.get<TAuthConfiguration>(
      this.configurationNamespace,
    ).resetPasswordUrl;
  }
}
