import { registerAs } from '@nestjs/config';

import { AppEnvironment } from '@app/common/enums';

import { TMongoConfiguration } from './config.types';
import ConfigurationNamespaces from '../../config.namespace';

export default registerAs(
  ConfigurationNamespaces.DATABASE.MONGO,
  (): TMongoConfiguration => ({
    host: process.env.MONGO_HOST as string,
    port: process.env.MONGO_PORT as string,
    name:
      process.env.NODE_ENV === AppEnvironment.TEST
        ? 'test'
        : process.env.MONGO_DB as string,
    user: process.env.MONGO_USER as string,
    password: process.env.MONGO_PASSWORD as string,
    logging: process.env.DB_LOGGING === 'true',
  }),
);
