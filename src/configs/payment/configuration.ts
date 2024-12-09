import { registerAs } from '@nestjs/config';

import { TPaymentConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.PAYMENT,
  (): TPaymentConfiguration => ({
    vakifBankVPosBaseUrl: process.env.VAKIF_BANK_VPOS_BASE_URI,
    vakifBank3DSBaseUrl: process.env.VAKIF_BANK_3DS_BASE_URI,
    vakifBankMerchantId: process.env.VAKIF_BANK_MERCHANT_ID,
    vakifBankMerchantPassword: process.env.VAKIF_BANK_MERCHANT_PASSWORD,
    vakifBankTerminalNumber: process.env.VAKIF_BANK_TERMINAL_NO,
    biletAll3DSBaseUrl: process.env.BILETALL_3DS_BASE_URI,
    biletAll3DSUsername: process.env.BILETALL_PASSWORD,
    biletAll3DSPassword: process.env.BILETALL_USERNAME,
  }),
);
