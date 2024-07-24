import { registerAs } from '@nestjs/config';

import { TAuthConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.AUTH,
  (): TAuthConfiguration => ({
    jwtSecret: process.env.JWT_SECRET,
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
    resetPasswordUrl: process.env.RESET_PASSWORD_URL,
  }),
);
