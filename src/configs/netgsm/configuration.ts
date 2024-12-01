import { registerAs } from '@nestjs/config';

import { TNetGsmConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.NETGSM,
  (): TNetGsmConfiguration => ({
    netGsmBaseURL: process.env.NETGSM_BASE_URL,
    netGsmUsername: process.env.NETGSM_USERNAME,
    netGsmPassword: process.env.NETGSM_PASSWORD,
    netGsmAppKey: process.env.NETGSM_APP_KEY,
  }),
);
