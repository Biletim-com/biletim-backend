import { registerAs } from '@nestjs/config';

import { AppEnvironment } from '@app/common/enums';

import { TMongoConfiguration } from './config.types';
import ConfigurationNamespaces from '../../config.namespace';

export default registerAs(
  ConfigurationNamespaces.DATABASE.MONGO,
  (): TMongoConfiguration => ({
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    name:
      process.env.NODE_ENV === AppEnvironment.TEST
        ? 'test'
        : process.env.MONGO_DB,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    logging: process.env.DB_LOGGING === 'true',
  }),
);
