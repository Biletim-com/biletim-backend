import { registerAs } from '@nestjs/config';

import { TSuperAdminConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.SUPER_ADMIN,
  (): TSuperAdminConfiguration => ({
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
    superAdminKey: process.env.SUPER_ADMIN_KEY,
  }),
);
