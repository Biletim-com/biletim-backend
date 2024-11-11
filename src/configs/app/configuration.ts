import { registerAs } from '@nestjs/config';

import { TAppConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.APPLICATION,
  (): TAppConfiguration => ({
    env: process.env.NODE_ENV,
    port: parseInt(process.env.APP_PORT || '8080'),
    corsWhitelist: process.env.CORS_WHITELIST || '*',
    backendUrl: process.env.BACKEND_URL,
  }),
);
