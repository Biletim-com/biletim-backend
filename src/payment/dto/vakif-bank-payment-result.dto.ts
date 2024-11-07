import { UUID } from '@app/common/types';

export class VakifBankPaymentResultDto {
  MerchantId: string;
  Pan: string;
  Expiry: string;
  VerifyEnrollmentRequestId: UUID;
  PurchAmount: string;
  PurchCurrency: string;
  Xid: string;
  SessionInfo: string;
  Status: 'Y' | 'A' | 'U' | 'E' | 'N';
  Cavv: string;
  Eci: string;
  ErrorCode: string;
  ErrorMessage: string;
}
