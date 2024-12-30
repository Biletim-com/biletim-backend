import { registerAs } from '@nestjs/config';

import { TNotificationsConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.NOTIFICATIONS,
  (): TNotificationsConfiguration => ({
    emailHost: process.env.EMAIL_HOST,
    emailPort: parseInt(process.env.EMAIL_PORT),
    emailUsername: process.env.EMAIL_USERNAME,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailUseSSL: process.env.EMAIL_USE_SSL === 'true',
    emailFrom: process.env.EMAIL_FROM,
  }),
);
