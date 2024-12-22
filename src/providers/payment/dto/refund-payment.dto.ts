import { UUID } from '@app/common/types';

export class RefundPaymentDto {
  clientIp: string;
  transactionId: UUID;
  refundAmount: string;
}
