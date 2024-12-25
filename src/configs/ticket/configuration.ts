import { registerAs } from '@nestjs/config';

import { TTicketConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.TICKET,
  (): TTicketConfiguration => ({
    biletAllBaseUrl: process.env.BILETALL_BASE_URI,
    biletAllUsername: process.env.BILETALL_USERNAME,
    biletAllPassword: process.env.BILETALL_PASSWORD,
  }),
);
