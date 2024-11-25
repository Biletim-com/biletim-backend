import { registerAs } from '@nestjs/config';

import { TNetGsmConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.NETGSM,
  (): TNetGsmConfiguration => ({
    netGsmBaseURL: process.env.NETGSM_BASE_URL as string,
    netGsmUsername: process.env.NETGSM_USERNAME as string,
    netGsmPassword: process.env.NETGSM_PASSWORD as string,
    netGsmAppKey: process.env.NETGSM_APP_KEY as string,
  }),
);
