import { registerAs } from '@nestjs/config';

import { TAuthConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

const DEFAULT_JWT_EXPIRATION = 172800; // 2 days

export default registerAs(
  ConfigurationNamespaces.AUTH,
  (): TAuthConfiguration => ({
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: Number(process.env.JWT_EXPIRATION) || DEFAULT_JWT_EXPIRATION,
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
    resetPasswordUrl: process.env.RESET_PASSWORD_URL,
  }),
);
