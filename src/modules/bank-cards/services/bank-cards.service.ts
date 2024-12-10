import { compareSync, hashSync } from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { User } from '../../users/user.entity';
import { UsersRepository } from '../../users/users.repository';
import { BankCard } from '../bank-card.entity';
import { BankCardsRepository } from '../bank-cards.repository';
import { VakifBankCardService } from '@app/providers/payment/vakif-bank/services/vakif-bank-card.service';
import { VakifBankCustomerService } from '@app/providers/payment/vakif-bank/services/vakif-bank-customer.service';
import { GarantiCardService } from '@app/providers/payment/garanti/services/garanti-card.service';

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
    private readonly vakifBankCardService: VakifBankCardService,
    private readonly vakifBankCustomerService: VakifBankCustomerService,
    private readonly garantiBankCardService: GarantiCardService,
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

    // create user first on VPOS
    const customerId = this.vakifBankCustomerService.generateVPosCustomerId(
      existingUser.id,
    );
    if (existingUserCards.length === 0) {
      await this.vakifBankCustomerService.createCustomer({
        ...existingUser,
        id: customerId as UUID,
      });
    }

    // create credit card tokens
    const vakifBankCardTokenPromise =
      await this.vakifBankCardService.createCustomerCard(
        customerId,
        createBankCardDto,
      );
    const garantiCardTokenPromise =
      await this.garantiBankCardService.createCustomerCard(
        existingUser.id,
        createBankCardDto,
      );

    const [vakifBankCardToken, garantiCardToken] = await Promise.all([
      vakifBankCardTokenPromise,
      garantiCardTokenPromise,
    ]);

    // create card on DB
    const bankCardToCreate = new BankCard({
      name: createBankCardDto.name,
      holderName: createBankCardDto.holderName,
      expiryDate: createBankCardDto.expiryDate,
      vakifPanToken: vakifBankCardToken,
      garantiPanToken: garantiCardToken,
      // TODO: REPLACE IT WITH RATEHAWK TOKEN
      ratehawkPanToken: vakifBankCardToken,
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
  ): Promise<void> {
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

    await Promise.all([
      await this.vakifBankCardService.deleteCustomerCard(
        this.vakifBankCustomerService.generateVPosCustomerId(existingUser.id),
        existingCard.vakifPanToken,
      ),
      await this.garantiBankCardService.deleteCustomerCard(
        existingUser.id,
        existingCard.garantiPanToken,
      ),
    ]);
    await this.bankCardsRepository.delete(existingCard.id);
  }
}
