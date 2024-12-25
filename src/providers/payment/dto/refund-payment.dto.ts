import { UUID } from '@app/common/types';

export abstract class RefundPaymentDetails {}

export class RefundPaymentDto<
  T extends RefundPaymentDetails = RefundPaymentDetails,
> {
  clientIp: string;
  transactionId: UUID;
  refundAmount: string;
  details: T;
}
