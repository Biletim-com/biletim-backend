export type TPaymentConfiguration = {
  // vakifbank
  vakifBankVPosBaseUrl: string;
  vakifBank3DSBaseUrl: string;
  vakifBankMerchantId: string;
  vakifBankMerchantPassword: string;
  vakifBankTerminalNumber: string;

  // biletall
  biletAll3DSBaseUrl: string;
  biletAll3DSUsername: string;
  biletAll3DSPassword: string;

  garantiVPosBaseUrl: string;
  garantiSwitchId: string;
  garantiSwitchPassword: string;
};
