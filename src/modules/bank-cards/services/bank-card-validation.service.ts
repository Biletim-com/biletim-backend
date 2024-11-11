import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';

import { BankCardsRepository } from '../bank-cards.repository';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class BankCardValidationService {
  constructor(private readonly bankCardsRepository: BankCardsRepository) {}

  public async isUserCardUnique(
    userId: UUID,
    cardPan: string,
  ): Promise<boolean> {
    const existingUserCards = await this.bankCardsRepository.findBy({
      user: { id: userId },
    });
    const existingUserCard = existingUserCards.find((existingUserCard) =>
      compareSync(cardPan, existingUserCard.hash),
    );
    return !!!existingUserCard;
  }
}
