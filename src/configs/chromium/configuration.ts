import { registerAs } from '@nestjs/config';

import { TChromiumConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.CHROMIUM,
  (): TChromiumConfiguration => ({
    host: process.env.CHOROMIUM_HOST,
    port: process.env.CHOROMIUM_PORT,
  }),
);
