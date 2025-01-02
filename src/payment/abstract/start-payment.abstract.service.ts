// services
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';

// factories
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';

// entities
import { User } from '@app/modules/users/user.entity';
import { Invoice } from '@app/modules/invoices/invoice.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';

// repositories
import { UsersRepository } from '@app/modules/users/users.repository';

// dtos
import { BiletimGoPaymentResultDto } from '@app/providers/payment/biletim-go/dto/biletim-go-payment-result.dto';
import { VakifBankSavedCardPaymentFinishDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';
import { PaymentMethod } from '@app/providers/payment/dto/payment-start.dto';
import { PaymentMethodDto } from '../dto/purchase.dto';
import { InvoiceDto } from '../dto/invoice.dto';

// errors
import {
  ServiceError,
  UserNotFoundError,
  BankCardNotFoundError,
  WalletNotFoundError,
} from '@app/common/errors';

// enums
import {
  Currency,
  InvoiceType,
  PaymentFlowType,
  PaymentProvider,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';

// event name types
import { PaymentEventsMap } from '@app/providers/event-emitter/events/payment-events.type';

export abstract class AbstractStartPaymentService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitterService,
    private readonly paymentProviderFactory: PaymentProviderFactory,
  ) {}

  protected async validatePaymentMethod(
    paymentMethodDto: PaymentMethodDto,
    user?: User,
  ): Promise<PaymentMethod> {
    const paymentMethod: PaymentMethod = {};

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
    if (user && !userWalletAndCards) {
      throw new UserNotFoundError();
    }

    // validate user's wallet
    if (paymentMethodDto.useWallet) {
      const userWallet = userWalletAndCards?.wallet;
      if (!userWallet) {
        throw new WalletNotFoundError();
      }
      paymentMethod['wallet'] = userWallet;
      return paymentMethod;
    }

    // validate user's saved card
    if (paymentMethodDto.savedCardId) {
      const userSavedCard = userWalletAndCards?.bankCards.find(
        (bankCard) => bankCard.id === paymentMethodDto.savedCardId,
      );
      if (!userSavedCard) {
        throw new BankCardNotFoundError();
      }
      paymentMethod['savedBankCard'] = userSavedCard;
      return paymentMethod;
    }

    paymentMethod['bankCard'] = paymentMethodDto.bankCard;

    if (Object.values(paymentMethodDto).length === 0) {
      throw new ServiceError('One of the payment methods has to be chosen');
    }

    return paymentMethod;
  }

  protected composeOrderInvoice(invoiceDto: InvoiceDto): Invoice {
    const invoiceType: InvoiceType = invoiceDto.individual
      ? InvoiceType.INDIVIDUAL
      : InvoiceType.CORPORATE;

    const invoiceData = {
      ...(invoiceDto.individual || {}),
      ...(invoiceDto.company || {}),
    };

    return new Invoice({
      type: invoiceType,
      pnr: null,
      recipientName:
        `${invoiceData.firstName} ${invoiceData.lastName}` || invoiceData.name,
      identifier: invoiceData.tcNumber || invoiceData.taxNumber,
      address: invoiceData.address,
      taxOffice: invoiceData.taxOffice,
      phoneNumber: invoiceData.phoneNumber,
      email: invoiceData.email,
    });
  }

  protected composeTransaction(
    totalTicketPrice: string,
    paymentProvider: PaymentProvider,
    paymentMethod: PaymentMethod,
  ): Transaction {
    return new Transaction({
      amount: totalTicketPrice,
      currency: Currency.TRY,
      status: TransactionStatus.PENDING,
      transactionType: TransactionType.PURCHASE,
      paymentProvider,
      // unregistered card
      ...(paymentMethod.bankCard
        ? {
            cardholderName: paymentMethod.bankCard.holderName,
            maskedPan: paymentMethod.bankCard.maskedPan,
          }
        : {}),

      // saved bank card
      ...(paymentMethod.savedBankCard
        ? {
            bankCard: paymentMethod.savedBankCard,
          }
        : {}),

      // wallet
      ...(paymentMethod.wallet ? { wallet: paymentMethod.wallet } : {}),
    });
  }

  protected async finalizePaymentInit(
    transaction: Transaction,
    paymentProviderType: PaymentProvider,
    paymentMethod: PaymentMethod,
    paymentFlowType: PaymentFlowType,
    finishEventName: keyof PaymentEventsMap,
    clientIp: string,
    user?: User,
  ): Promise<string | null> {
    let htmlContent: string | null = null;
    /**
     * If it is BankCard passed to finish payment, generate htmlContent
     */
    if (paymentMethod.bankCard) {
      const paymentProvider =
        this.paymentProviderFactory.getStrategy(paymentProviderType);
      htmlContent = await paymentProvider.start3DSAuthorization({
        clientIp,
        paymentFlowType,
        paymentMethod: { bankCard: paymentMethod.bankCard },
        transaction,
      });
    }

    /**
     * Finish payments direnctly made with wallets and saved cards
     */
    if (paymentMethod.wallet || paymentMethod.savedBankCard) {
      const eventDetails:
        | BiletimGoPaymentResultDto
        | VakifBankSavedCardPaymentFinishDto = paymentMethod.wallet
        ? {
            amount: transaction.amount,
            walletId: paymentMethod.wallet.id,
          }
        : ({
            amount: transaction.amount,
            cardToken: paymentMethod.savedBankCard?.vakifPanToken,
            currency: Currency.TRY,
            transactionId: transaction.id,
            userId: user?.id,
          } as VakifBankSavedCardPaymentFinishDto);

      this.eventEmitter.emitEvent<keyof PaymentEventsMap>(
        finishEventName,
        clientIp,
        transaction.id,
        eventDetails,
      );
    }

    return htmlContent;
  }
}
