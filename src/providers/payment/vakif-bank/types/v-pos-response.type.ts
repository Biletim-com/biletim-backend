type BaseVposResponse = {
  MerchantId: string;
  TransactionType: 'Sale' | 'Cancel' | 'Refund';
  TransactionId: string;
  ResultCode: string;
  ResultDetail: string;
  AuthCode: string;
  HostDate: string;
  Rrn: string;
  GainedPoint: string;
  TotalPoint: string;
  CurrencyAmount: string;
  CurrencyCode: string;
  BatchNo: string;
  TLAmount: string;
};

export type SaleResponse = {
  VposResponse: {
    TransactionType: 'Sale';
    OrderId: string;
    ThreeDSecureType: string;
  } & BaseVposResponse;
};

export type CancelResponse = {
  VposResponse: {
    TransactionType: 'Cancel';
    ReferenceTransactionId: string;
    InstallmentTable: string;
    CampaignResult: {
      CampaignInfo: string;
    };
    ThreeDSecureType: string;
    TransactionDeviceSource: string;
    TerminalNo: string;
  } & BaseVposResponse;
};

export type RefundResponse = {
  VposResponse: {
    TransactionType: 'Refund';
    ReferenceTransactionId: string;
    InstallmentTable: string;
    CampaignResult: {
      CampaignInfo: string;
    };
    TransactionDeviceSource: string;
    TerminalNo: string;
  } & BaseVposResponse;
};

export type VposResponse = SaleResponse | CancelResponse | RefundResponse;
