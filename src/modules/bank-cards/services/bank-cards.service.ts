import { compareSync, hashSync } from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { User } from '../../users/user.entity';
import { UsersRepository } from '../../users/users.repository';
import { BankCard } from '../bank-card.entity';
import { BankCardsRepository } from '../bank-cards.repository';
import { BankCardValidationService } from './bank-card-validation.service';
import { VakifBankCardService } from '@app/payment/providers/vakif-bank/services/vakif-bank-card.service';
import { VakifBankCustomerService } from '@app/payment/providers/vakif-bank/services/vakif-bank-customer.service';

// dtos
import { UpdateBankCardDto } from '../dto/update-bank-card-request.dto';
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
    private readonly bankCardValidationService: BankCardValidationService,
    private readonly usersRepository: UsersRepository,
    private readonly vakifBankCardService: VakifBankCardService,
    private readonly vakifBankCustomerService: VakifBankCustomerService,
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

    // create credit card
    const createdVPosCard = await this.vakifBankCardService.createCustomerCard(
      customerId,
      createBankCardDto,
    );

    // create card on DB
    const bankCardToCreate = new BankCard({
      name: createBankCardDto.name,
      holderName: createBankCardDto.holderName,
      expiryDate: createBankCardDto.expiryDate,
      vakifPanToken: createdVPosCard.CreateCustomerPanResponse.PanCode,
      // TODO: REPLACE IT WITH GARANTI
      garantiPanToken: createdVPosCard.CreateCustomerPanResponse.PanCode,
      // TODO: REPLACE IT WITH RATEHAWK TOKEN
      ratehawkPanToken: createdVPosCard.CreateCustomerPanResponse.PanCode,
      hash: hashSync(createBankCardDto.pan, 12),
      maskedPan: createBankCardDto.maskedPan,
      user: existingUser,
    });

    await this.bankCardsRepository.insert(bankCardToCreate);
    return bankCardToCreate;
  }

  async updateBankCard(
    userOrUserId: User | UUID,
    bankCardId: UUID,
    updateBankCardDto: UpdateBankCardDto,
  ): Promise<BankCard> {
    const { name, holderName, expiryDate, pan, maskedPan } = updateBankCardDto;
    const existingUser = await this.usersRepository.findEntityData(
      userOrUserId,
    );

    const existingBankCard = await this.bankCardsRepository.findOneBy({
      id: bankCardId,
      user: { id: existingUser.id },
    });
    if (!existingBankCard) {
      throw new BankCardNotFoundError();
    }

    if (pan) {
      const isBankCardUnique =
        await this.bankCardValidationService.isUserCardUnique(
          existingUser.id,
          pan,
        );
      if (!isBankCardUnique) {
        throw new BankCardUniqueConstraintViolationError(['pan']);
      }
    }

    const bankCardToUpdate = new BankCard({
      name,
      holderName,
      expiryDate,
      ...(pan
        ? {
            hash: hashSync(pan, 12),
            maskedPan,
          }
        : {}),
    });

    await this.vakifBankCardService.updateCustomerCard(
      this.vakifBankCustomerService.generateVPosCustomerId(existingUser.id),
      {
        panToken: existingBankCard.vakifPanToken,
        pan,
        holderName,
        expiryDate,
      },
    );

    await this.bankCardsRepository.update(
      existingBankCard.id,
      bankCardToUpdate,
    );

    return { ...existingBankCard, ...bankCardToUpdate };
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

    await this.vakifBankCardService.deleteCustomerCard(
      this.vakifBankCustomerService.generateVPosCustomerId(existingUser.id),
      existingCard.vakifPanToken,
    );
    await this.bankCardsRepository.delete(existingCard.id);
  }
}
