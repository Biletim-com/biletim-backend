import { UUID } from '@app/common/types';
import { IsString, IsUUID } from 'class-validator';

export class PaymentResultDto {
  @IsString()
  MerchantId: string;

  @IsString()
  Pan: string;

  @IsString()
  Expiry: string;

  @IsUUID()
  VerifyEnrollmentRequestId: UUID;

  @IsString()
  PurchAmount: string;

  @IsString()
  PurchCurrency: string;

  @IsString()
  Xid: string;

  @IsString()
  SessionInfo: string;

  @IsString()
  Status: 'Y' | 'A' | 'U' | 'E' | 'N';

  @IsString()
  Cavv: string;

  @IsString()
  Eci: string;

  @IsString()
  ErrorCode: string;

  @IsString()
  ErrorMessage: string;
}
