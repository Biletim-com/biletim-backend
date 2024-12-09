import { registerAs } from '@nestjs/config';

import { TTicketConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.TICKET,
  (): TTicketConfiguration => ({
    biletAllBaseUrl: process.env.BILETALL_BASE_URI,
    biletAllUsername: process.env.BILETALL_USERNAME,
    biletAllPassword: process.env.BILETALL_PASSWORD,
    biletAllExtraBaseUrl:
      process.env.BILETALL_EXTRA_BASE_URI || process.env.BILETALL_BASE_URI,
    biletAllExtraUsername:
      process.env.BILETALL_EXTRA_USERNAME || process.env.BILETALL_USERNAME,
    biletAllExtraPassword:
      process.env.BILETALL_EXTRA_PASSWORD || process.env.BILETALL_PASSWORD,
  }),
);
