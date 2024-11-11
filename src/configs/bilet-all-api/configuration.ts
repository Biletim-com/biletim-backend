import { registerAs } from '@nestjs/config';

import { TBiletAllApiConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.BILET_ALL_API,
  (): TBiletAllApiConfiguration => ({
    biletAllApiBaseUrl: process.env.BILETALL_BASE_URI,
    biletAll3DSBaseUrl: process.env.BILETALL_3DSECURE_BASE_URI,
    biletAllApiUsername: process.env.BILETALL_WS_USERNAME,
    biletAllApiPassword: process.env.BILETALL_WS_PASSWORD,
  }),
);
