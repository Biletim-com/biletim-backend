import { UUID } from '@app/common/types';

export class CancelPaymentDto {
  clientIp: string;
  transactionId: UUID;
}
