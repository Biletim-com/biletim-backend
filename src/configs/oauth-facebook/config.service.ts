import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ConfigurationNamespaces from '../config.namespace';
import { TOAuthLoginWithFacebookConfiguration } from './config.types';

@Injectable()
export class OAuthLoginWithFacebookConfigService {
  private readonly configurationNamespace =
    ConfigurationNamespaces.LOGIN_WITH_FACEBOOK;

  constructor(private configService: ConfigService) {}

  get clientId(): string {
    return this.configService.getOrThrow<TOAuthLoginWithFacebookConfiguration>(
      this.configurationNamespace,
    ).clientId;
  }

  get clientSecret(): string {
    return this.configService.getOrThrow<TOAuthLoginWithFacebookConfiguration>(
      this.configurationNamespace,
    ).clientSecret;
  }
}
