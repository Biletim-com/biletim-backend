import { compareSync, hashSync } from 'bcryptjs';
import { Injectable } from '@nestjs/common';

import { User } from '../../users/user.entity';
import { UsersRepository } from '../../users/users.repository';
import { BankCard } from '../bank-card.entity';
import { BankCardsRepository } from '../bank-cards.repository';
import { ProvidersBankCardService } from './provider-bank-card-create.service';

// dtos
import { CreateBankCardDto } from '../dto/create-bank-card-request.dto';

// types
import { UUID } from '@app/common/types';

// errors
import {
  BankCardNotFoundError,
  BankCardUniqueConstraintViolationError,
} from '@app/common/errors';

@Injectable()
export class BankCardsService {
  constructor(
    private readonly bankCardsRepository: BankCardsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly providersBankCardService: ProvidersBankCardService,
  ) {}

  async listBankCards(userOrUserId: User | UUID): Promise<BankCard[]> {
    const existingUser = await this.usersRepository.findEntityData(
      userOrUserId,
    );

    return this.bankCardsRepository.find({
      where: { user: { id: existingUser.id } },
    });
  }

  async createBankCard(
    userOrUserId: User | UUID,
    createBankCardDto: CreateBankCardDto,
  ): Promise<BankCard> {
    const existingUser = await this.usersRepository.findEntityData(
      userOrUserId,
    );

    const existingUserCards = await this.bankCardsRepository.findBy({
      user: { id: existingUser.id },
    });
    const existingUserCard = existingUserCards.find((existingUserCard) =>
      compareSync(createBankCardDto.pan, existingUserCard.hash),
    );

    if (existingUserCard) {
      throw new BankCardUniqueConstraintViolationError(['pan']);
    }

    // create bank card tokens
    const [vakifBankCardToken, garantiCardToken] =
      await this.providersBankCardService.createCustomerCards(
        createBankCardDto,
        existingUser,
        existingUserCards.length !== 0,
      );

    // create card on DB
    const bankCardToCreate = new BankCard({
      name: createBankCardDto.name,
      holderName: createBankCardDto.holderName,
      expiryDate: createBankCardDto.expiryDate,
      vakifPanToken: vakifBankCardToken,
      garantiPanToken: garantiCardToken,
      hash: hashSync(createBankCardDto.pan, 12),
      maskedPan: createBankCardDto.maskedPan,
      user: existingUser,
    });

    await this.bankCardsRepository.insert(bankCardToCreate);
    return bankCardToCreate;
  }

  async deleteBankCard(
    userOrUserId: User | UUID,
    bankCardId: UUID,
  ): Promise<boolean> {
    const existingUser = await this.usersRepository.findEntityData(
      userOrUserId,
    );

    const existingCard = await this.bankCardsRepository.findOneBy({
      id: bankCardId,
      user: { id: existingUser.id },
    });
    if (!existingCard) {
      throw new BankCardNotFoundError();
    }

    await this.providersBankCardService.deleteCustomerCards(
      existingUser.id,
      existingCard.vakifPanToken,
      existingCard.garantiPanToken,
    );
    const result = await this.bankCardsRepository.delete(existingCard.id);
    return !!result.affected;
  }
}
