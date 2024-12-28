import { PaymentFlowType } from '@app/common/enums';
import { UUID } from '@app/common/types';

export type PaymentResultQueryParams = {
  transactionId: UUID;
  paymentFlowType: PaymentFlowType;
};
