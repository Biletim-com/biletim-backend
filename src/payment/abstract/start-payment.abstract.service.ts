// entities
import { User } from '@app/modules/users/user.entity';

// repositories
import { UsersRepository } from '@app/modules/users/users.repository';

// dtos
import { PaymentStartDto } from '@app/providers/payment/dto/payment-start.dto';
import { PaymentMethodDto } from '../dto/purchase.dto';

// errors
import {
  ServiceError,
  UserNotFoundError,
  BankCardNotFoundError,
  WalletNotFoundError,
} from '@app/common/errors';

export abstract class AbstractStartPaymentService {
  constructor(private readonly usersRepository: UsersRepository) {}

  protected async validatePaymentMethod(
    paymentMethodDto: PaymentMethodDto,
    user?: User,
  ): Promise<PaymentStartDto['paymentMethod']> {
    const paymentMethod: PaymentStartDto['paymentMethod'] = {};

    if (
      (!user && paymentMethodDto.useWallet) ||
      (!user && paymentMethodDto.savedCardId)
    ) {
      throw new ServiceError(
        'payment couldnt be initialized without the user identified',
      );
    }

    // fetch user's saved cards and wallet
    const userWalletAndCards = await this.usersRepository.findOne({
      where: { id: user?.id },
      relations: { wallet: true, bankCards: true },
    });
    if (!userWalletAndCards) {
      throw new UserNotFoundError();
    }

    // validate user's wallet
    if (paymentMethodDto.useWallet) {
      const userWallet = userWalletAndCards.wallet;
      if (!userWallet) {
        throw new WalletNotFoundError();
      }
      paymentMethod['wallet'] = userWallet;
    }

    // validate user's saved card
    if (paymentMethodDto.savedCardId) {
      const userSavedCard = userWalletAndCards.bankCards.find(
        (bankCard) => bankCard.id === paymentMethodDto.savedCardId,
      );
      if (!userSavedCard) {
        throw new BankCardNotFoundError();
      }
      paymentMethod['savedBankCard'] = userSavedCard;
    }

    paymentMethod['bankCard'] = paymentMethodDto.bankCard;

    if (Object.values(paymentMethodDto).length === 0) {
      throw new ServiceError('One of the payment methods has to be chosen');
    }

    return paymentMethod;
  }
}
