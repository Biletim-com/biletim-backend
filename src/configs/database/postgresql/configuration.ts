import { registerAs } from '@nestjs/config';

import { TPostgreSQLConfiguration } from './config.types';
import ConfigurationNamespaces from '../../config.namespace';
import { Environment } from '../../app/config.types';

export default registerAs(
  ConfigurationNamespaces.DATABASE.POSTGRESQL,
  (): TPostgreSQLConfiguration => ({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    name:
      process.env.NODE_ENV === Environment.TEST
        ? 'test'
        : process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    logging: process.env.DB_LOGGING === 'true',
  }),
);
