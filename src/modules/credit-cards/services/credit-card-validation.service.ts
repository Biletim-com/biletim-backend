import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';

import { CreditCardsRepository } from '../credit-cards.repository';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class CreditCardValidationService {
  constructor(private readonly creditCardsRepository: CreditCardsRepository) {}

  public async isUserCardUnique(
    userId: UUID,
    cardPan: string,
  ): Promise<boolean> {
    const existingUserCards = await this.creditCardsRepository.findBy({
      user: { id: userId },
    });
    const existingUserCard = existingUserCards.find((existingUserCard) =>
      compareSync(cardPan, existingUserCard.hash),
    );
    return !!!existingUserCard;
  }
}
