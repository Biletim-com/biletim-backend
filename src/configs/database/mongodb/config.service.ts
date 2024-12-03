import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../../config.namespace';
import { TMongoConfiguration } from './config.types';

@Injectable()
export class MongoConfigService {
  private readonly configurationNamespace =
    ConfigurationNamespaces.DATABASE.MONGO;

  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.getOrThrow<TMongoConfiguration>(
      this.configurationNamespace,
    ).host;
  }

  get database(): string {
    return this.configService.getOrThrow<TMongoConfiguration>(
      this.configurationNamespace,
    ).name;
  }

  get user(): string {
    return this.configService.getOrThrow<TMongoConfiguration>(
      this.configurationNamespace,
    ).user;
  }

  get password(): string {
    return this.configService.getOrThrow<TMongoConfiguration>(
      this.configurationNamespace,
    ).password;
  }

  get port(): number {
    return Number(
      this.configService.getOrThrow<TMongoConfiguration>(
        this.configurationNamespace,
      ).port,
    );
  }

  get mongoURI(): string {
    const { host, port, user, password, database } = this;
    return `mongodb://${user}:${password}@${host}:${port}/${database}?retryWrites=true&w=majority`;
  }

  get logging(): boolean {
    return this.configService.getOrThrow<TMongoConfiguration>(
      this.configurationNamespace,
    ).logging;
  }
}
