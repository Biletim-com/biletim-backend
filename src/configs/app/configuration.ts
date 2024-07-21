import { registerAs } from '@nestjs/config';

import { TAppConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.APPLICATION,
  (): TAppConfiguration => ({
    env: process.env.NODE_ENV,
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    corsWhitelist: process.env.CORS_WHITELIST || '*',
    biletAllURI: process.env.BILETALL_WSDL_URI,
    biletAllUsername: process.env.BILETALL_WS_USERNAME,
    biletAllPassword: process.env.BILETALL_WS_PASSWORD,
  }),
);
