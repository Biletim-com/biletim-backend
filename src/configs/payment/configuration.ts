import { registerAs } from '@nestjs/config';

import { TPaymentConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.PAYMENT,
  (): TPaymentConfiguration => ({
    vakifBankVPosBaseUrl: process.env.VAKIF_BANK_VPOS_BASE_URI as string,
    vakifBank3DSBaseUrl: process.env.VAKIF_BANK_3DS_BASE_URI as string,
    vakifBankMerchantId: process.env.VAKIF_BANK_MERCHANT_ID as string,
    vakifBankMerchantPassword: process.env.VAKIF_BANK_MERCHANT_PASSWORD as string,
    vakifBankTerminalNumber: process.env.VAKIF_BANK_TERMINAL_NO as string,
    biletAll3DSBaseUrl: process.env.BILETALL_3DS_BASE_URI as string,
    biletAll3DSUsername: process.env.BILETALL_PASSWORD as string,
    biletAll3DSPassword: process.env.BILETALL_USERNAME as string,
    garantiVPosBaseUrl: process.env.GARANTI_VPOS_BASE_URI as string,
    garantiSwitchId: process.env.GARANTI_SWITCH_ID as string,
    garantiSwitchPassword: process.env.GARANTI_SWITCH_PASSWORD as string,
  }),
);
