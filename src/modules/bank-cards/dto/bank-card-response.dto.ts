import { DateISODate, UUID } from '@app/common/types';
import { BankCard } from '../bank-card.entity';

export class BankCardResponseDto {
  id: UUID;
  name: string;
  holderName: string;
  expiryDate: DateISODate;
  maskedPan: string;

  constructor(bankCard: BankCard) {
    this.id = bankCard.id;
    this.name = bankCard.name;
    this.holderName = bankCard.holderName;
    this.expiryDate = bankCard.expiryDate;
    this.maskedPan = bankCard.maskedPan;
  }
}
