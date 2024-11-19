import { registerAs } from '@nestjs/config';

import { TPaymentConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.PAYMENT,
  (): TPaymentConfiguration => ({
    vPosBaseUrl: process.env.PAYMENT_VPOS_BASE_URI,
    threeDSecureBaseUrl: process.env.PAYMENT_3DSECURE_BASE_URI,
    merchantId: process.env.PAYMENT_MERCHANT_ID,
    merchantPassword: process.env.PAYMENT_MERCHANT_PASSWORD,
    terminalNumber: process.env.PAYMENT_TERMINAL_NO,
  }),
);
