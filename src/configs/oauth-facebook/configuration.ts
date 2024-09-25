import { registerAs } from '@nestjs/config';

import ConfigurationNamespaces from '../config.namespace';
import { TOAuthLoginWithFacebookConfiguration } from './config.types';

export default registerAs(
  ConfigurationNamespaces.LOGIN_WITH_GOOGLE,
  (): TOAuthLoginWithFacebookConfiguration => ({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
  }),
);
