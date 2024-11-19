import { registerAs } from '@nestjs/config';

import { TQueueConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.QUEUE,
  (): TQueueConfiguration => ({
    redisHost: process.env.REDIS_HOST || "localhost",
    redisPort: process.env.REDIS_PORT || "6379",
    redisPassword: process.env.REDIS_PASSWORD || "my-password",
  }),
);
