import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TOAuthLoginWithGoogleConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

@Injectable()
export class OAuthLoginWithGoogleConfigService {
  private readonly configurationNamespace =
    ConfigurationNamespaces.LOGIN_WITH_GOOGLE;

  constructor(private configService: ConfigService) {}

  get clientId(): string {
    return this.configService.getOrThrow<TOAuthLoginWithGoogleConfiguration>(
      this.configurationNamespace,
    ).clientId;
  }

  get clientSecret(): string {
    return this.configService.getOrThrow<TOAuthLoginWithGoogleConfiguration>(
      this.configurationNamespace,
    ).clientSecret;
  }
}
