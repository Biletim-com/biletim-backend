import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';

import { TSuperAdminConfiguration } from './config.types';

@Injectable()
export class SuperAdminConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.SUPER_ADMIN;

  constructor(private configService: ConfigService) {}

  get superAdminEmail(): string {
    return this.configService.getOrThrow<TSuperAdminConfiguration>(
      this.configurationNamespace,
    ).superAdminEmail;
  }

  get superAdminPassword(): string {
    return this.configService.getOrThrow<TSuperAdminConfiguration>(
      this.configurationNamespace,
    ).superAdminPassword;
  }

  get superAdminKey(): string {
    return this.configService.getOrThrow<TSuperAdminConfiguration>(
      this.configurationNamespace,
    ).superAdminKey;
  }
}
