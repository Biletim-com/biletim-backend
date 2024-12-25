// entities
import { Wallet } from '@app/modules/wallets/wallet.entity';
import { BankCard } from '@app/modules/bank-cards/bank-card.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';

// dtos
import { BankCardDto } from '@app/common/dtos';

// enums
import { TicketType } from '@app/common/enums';

export abstract class PaymentMethodDto {
  bankCard?: BankCardDto;
  savedBankCard?: BankCard;
  wallet?: Wallet;
}

export class BankCardPaymentDto extends PaymentMethodDto {
  bankCard: BankCardDto;
}

export class SavedBankCardPaymentDto extends PaymentMethodDto {
  savedBankCard: BankCard;
}

export class WalletPaymentDto extends PaymentMethodDto {
  wallet: Wallet;
}

export class CombinedCardPaymentDto extends PaymentMethodDto {
  bankCard?: BankCardDto;
  savedBankCard?: BankCard;
}

export abstract class PaymentStartDto {
  clientIp: string;
  ticketType: TicketType;
  transaction: Transaction;
  paymentMethod: PaymentMethodDto;
}
