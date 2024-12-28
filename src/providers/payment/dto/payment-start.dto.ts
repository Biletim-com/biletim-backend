// entities
import { Wallet } from '@app/modules/wallets/wallet.entity';
import { BankCard } from '@app/modules/bank-cards/bank-card.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';

// dtos
import { BankCardDto } from '@app/common/dtos';

// enums
import { PaymentFlowType } from '@app/common/enums';

export abstract class PaymentMethod {
  bankCard?: BankCardDto;
  savedBankCard?: BankCard;
  wallet?: Wallet;
}

export class BankCardPaymentDto implements PaymentMethod {
  bankCard: BankCardDto;
}

export abstract class PaymentStart3DSAuthorizationDto {
  clientIp: string;
  paymentFlowType: PaymentFlowType;
  transaction: Transaction;
  paymentMethod: BankCardPaymentDto;
}
