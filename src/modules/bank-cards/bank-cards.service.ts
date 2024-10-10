import { Injectable } from '@nestjs/common';

import { BankCardsRepository } from './bank-cards.repository';

@Injectable()
export class BankCardsService {
  constructor(private readonly bankCardsRepository: BankCardsRepository) {}
}
