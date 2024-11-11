import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ConfigurationNamespaces from '../config.namespace';
import { TTamamliyoApiConfiguration } from './config.types';

@Injectable()
export class TamamliyoApiConfigService {
  private readonly configurationNamespace =
    ConfigurationNamespaces.TAMAMLIYO_API;

  constructor(private configService: ConfigService) {}

  get tamamliyoApiBaseUrl(): string {
    return this.configService.getOrThrow<TTamamliyoApiConfiguration>(
      this.configurationNamespace,
    ).tamamliyoApiBaseUrl;
  }

  get tamamliyoApiToken(): string {
    return this.configService.getOrThrow<TTamamliyoApiConfiguration>(
      this.configurationNamespace,
    ).tamamliyoApiToken;
  }
}
