import { Transaction } from '@app/modules/transactions/transaction.entity';

// dtos
import { VakifBankPaymentResultDto } from '../dto/vakif-bank-payment-result.dto';
import { BiletAllPaymentResultDto } from '../dto/biletall-payment-result.dto';

import { UUID } from '@app/common/types';

type PaymentResultDto = VakifBankPaymentResultDto | BiletAllPaymentResultDto;

export interface IPaymentResultHandler {
  handleSuccessfulBusTicketPayment(
    clientIp: string,
    paymentResultDto: PaymentResultDto,
  ): Promise<Transaction>;

  handleSuccessfulPlaneTicketPayment(
    clientIp: string,
    paymentResultDto: PaymentResultDto,
  ): Promise<Transaction>;

  handleSuccessfulHotelBookingPayment(
    clientIp: string,
    paymentResultDto: PaymentResultDto,
  ): Promise<Transaction>;

  handleFailedPayment(
    transactionId: UUID,
    errorMessage?: string,
  ): Promise<void>;
}
