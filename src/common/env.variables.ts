import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SuperAdminVariables } from './env.types';

@Injectable()
export class EnvVariables {
  @Inject(ConfigService)
  public static config: ConfigService;

  public static getSuperAdminVariables(): SuperAdminVariables {
    return {
      superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
      superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
      superAdminKey: process.env.SUPER_ADMIN_KEY,
    };
  }
}
