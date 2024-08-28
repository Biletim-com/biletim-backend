import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../../config.namespace';
import { TPostgreSQLConfiguration } from './config.types';

@Injectable()
export class PostgreSQLConfigService {
  private readonly configurationNamespace =
    ConfigurationNamespaces.DATABASE.POSTGRESQL;

  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.getOrThrow<TPostgreSQLConfiguration>(
      this.configurationNamespace,
    ).host;
  }

  get database(): string {
    return this.configService.getOrThrow<TPostgreSQLConfiguration>(
      this.configurationNamespace,
    ).name;
  }

  get user(): string {
    return this.configService.getOrThrow<TPostgreSQLConfiguration>(
      this.configurationNamespace,
    ).user;
  }

  get password(): string {
    return this.configService.getOrThrow<TPostgreSQLConfiguration>(
      this.configurationNamespace,
    ).password;
  }

  get port(): number {
    return Number(
      this.configService.getOrThrow<TPostgreSQLConfiguration>(
        this.configurationNamespace,
      ).port,
    );
  }

  get logging(): boolean {
    return this.configService.getOrThrow<TPostgreSQLConfiguration>(
      this.configurationNamespace,
    ).logging;
  }
}
