import { DynamicModule, Module } from '@nestjs/common';

import { PoxClientService } from './provider.service';
import { POX_CLIENT_PREFIX } from './decorators';

@Module({})
export class PoxClientModule {
  static registerAsync(options: {
    token: string;
    useFactory: (...args: any[]) => Promise<string> | string;
    inject: any[];
  }): DynamicModule {
    const prefixedToken = `${POX_CLIENT_PREFIX}${options.token}`;

    return {
      module: PoxClientModule,
      providers: [
        {
          provide: prefixedToken,
          useFactory: async (baseURL: string) => new PoxClientService(baseURL),
          inject: ['POX_BASE_URL'],
        },
        {
          provide: 'POX_BASE_URL',
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [prefixedToken],
    };
  }
}
