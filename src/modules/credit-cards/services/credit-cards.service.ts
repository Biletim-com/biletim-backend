import { compareSync, hashSync } from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { User } from '../../users/user.entity';
import { UsersRepository } from '../../users/users.repository';
import { CreditCard } from '../credit-card.entity';
import { CreditCardsRepository } from '../credit-cards.repository';
import { CreditCardValidationService } from '../services/credit-card-validation.service';
import { VakifBankCardService } from '@app/payment/providers/vakif-bank/services/vakif-bank-card.service';
import { VakifBankCustomerService } from '@app/payment/providers/vakif-bank/services/vakif-bank-customer.service';

// dtos
import { UpdateCreditCardDto } from '../dto/update-credit-card-request.dto';
import { CreateCreditCardDto } from '../dto/create-credit-card-request.dto';

// types
import { UUID } from '@app/common/types';

// errors
import {
  CreditCardNotFoundError,
  CreditCardUniqueConstraintViolationError,
} from '@app/common/errors';

@Injectable()
export class CreditCardsService {
  constructor(
    private readonly creditCardsRepository: CreditCardsRepository,
    private readonly creditCardValidationService: CreditCardValidationService,
    private readonly usersRepository: UsersRepository,
    private readonly vakifBankCardService: VakifBankCardService,
    private readonly vakifBankCustomerService: VakifBankCustomerService,
  ) {}

  async listCreditCards(userOrUserId: User | UUID): Promise<CreditCard[]> {
    const existingUser = await this.usersRepository.findEntityData(
      userOrUserId,
    );

    return this.creditCardsRepository.find({
      where: { user: { id: existingUser.id } },
    });
  }

  async createCreditCard(
    userOrUserId: User | UUID,
    createCreditCardDto: CreateCreditCardDto,
  ): Promise<CreditCard> {
    const existingUser = await this.usersRepository.findEntityData(
      userOrUserId,
    );

    const existingUserCards = await this.creditCardsRepository.findBy({
      user: { id: existingUser.id },
    });
    const existingUserCard = existingUserCards.find((existingUserCard) =>
      compareSync(createCreditCardDto.pan, existingUserCard.hash),
    );

    if (existingUserCard) {
      throw new CreditCardUniqueConstraintViolationError(['pan']);
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
      createCreditCardDto,
    );

    // create card on DB
    const creditCardToCreate = new CreditCard({
      name: createCreditCardDto.name,
      holderName: createCreditCardDto.holderName,
      expiryDate: createCreditCardDto.expiryDate,
      panToken: createdVPosCard.CreateCustomerPanResponse.PanCode,
      hash: hashSync(createCreditCardDto.pan, 12),
      maskedPan: createCreditCardDto.maskedPan,
      user: existingUser,
    });

    await this.creditCardsRepository.insert(creditCardToCreate);
    return creditCardToCreate;
  }

  async updateCreditCard(
    userOrUserId: User | UUID,
    creditCardId: UUID,
    updateCreditCardDto: UpdateCreditCardDto,
  ): Promise<CreditCard> {
    const { name, holderName, expiryDate, pan, maskedPan } =
      updateCreditCardDto;
    const existingUser = await this.usersRepository.findEntityData(
      userOrUserId,
    );

    const existingCreditCard = await this.creditCardsRepository.findOneBy({
      id: creditCardId,
      user: { id: existingUser.id },
    });
    if (!existingCreditCard) {
      throw new CreditCardNotFoundError();
    }

    if (pan) {
      const isCreditCardUnique =
        await this.creditCardValidationService.isUserCardUnique(
          existingUser.id,
          pan,
        );
      if (!isCreditCardUnique) {
        throw new CreditCardUniqueConstraintViolationError(['pan']);
      }
    }

    const creditCardToUpdate = new CreditCard({
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
        panToken: existingCreditCard.panToken,
        pan,
        holderName,
        expiryDate,
      },
    );

    await this.creditCardsRepository.update(
      existingCreditCard.id,
      creditCardToUpdate,
    );

    return { ...existingCreditCard, ...creditCardToUpdate };
  }

  async deleteCreditCard(
    userOrUserId: User | UUID,
    creditCardId: UUID,
  ): Promise<void> {
    const existingUser = await this.usersRepository.findEntityData(
      userOrUserId,
    );

    const existingCard = await this.creditCardsRepository.findOneBy({
      id: creditCardId,
      user: { id: existingUser.id },
    });
    if (!existingCard) {
      throw new CreditCardNotFoundError();
    }

    await this.vakifBankCardService.deleteCustomerCard(
      this.vakifBankCustomerService.generateVPosCustomerId(existingUser.id),
      existingCard.panToken,
    );
    await this.creditCardsRepository.delete(existingCard.id);
  }
}
