import { registerAs } from '@nestjs/config';

import { TMaileonConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.MAILEON,
  (): TMaileonConfiguration => ({
    maileonBaseURL: process.env.MAILEON_BASE_URL as string,
    maileonApiKey: process.env.MAILEON_API_KEY as string,
  }),
);
