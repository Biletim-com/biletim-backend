import { UUID } from '@app/common/types';

export abstract class PaymentDetailsDto {}

export class PaymentFinishDto<T extends PaymentDetailsDto = PaymentDetailsDto> {
  clientIp: string;
  orderId: UUID;
  details: T;
}
