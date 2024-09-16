import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { THotelApiConfiguration } from './config.types';

@Injectable()
export class HotelApiConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.HOTEL_API;

  constructor(private configService: ConfigService) {}

  get hotelApiBaseUrl(): string {
    return this.configService.getOrThrow<THotelApiConfiguration>(
      this.configurationNamespace,
    ).hotelApiBaseUrl;
  }

  get hotelApiUsername(): string {
    return this.configService.getOrThrow<THotelApiConfiguration>(
      this.configurationNamespace,
    ).hotelApiUsername;
  }

  get hotelApiPassword(): string {
    return this.configService.getOrThrow<THotelApiConfiguration>(
      this.configurationNamespace,
    ).hotelApiPassword;
  }
}
