import { registerAs } from '@nestjs/config';

import { TBiletAllApiConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.BILET_ALL_API,
  (): TBiletAllApiConfiguration => ({
    biletAllApiBaseUrl: process.env.BILETALL_WSDL_URI,
    biletAllApiUsername: process.env.BILETALL_WS_USERNAME,
    biletAllApiPassword: process.env.BILETALL_WS_PASSWORD,
  }),
);
