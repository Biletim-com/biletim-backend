import { registerAs } from '@nestjs/config';

import { AppEnvironment } from '@app/common/enums';

import { TMongoConfiguration } from './config.types';
import ConfigurationNamespaces from '../../config.namespace';

export default registerAs(
  ConfigurationNamespaces.DATABASE.MONGO,
  (): TMongoConfiguration => ({
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || '27017',
    name:
      process.env.NODE_ENV === AppEnvironment.TEST
        ? 'test'
        : process.env.MONGO_DB || 'my_database',
    user: process.env.MONGO_USER || 'default_user',
    password: process.env.MONGO_PASSWORD || 'default_password',
    logging: process.env.DB_LOGGING === 'true',
  }),
);
