import {
  Body,
  Controller,
  Post,
  Query,
  Req,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Transaction } from '@app/modules/transactions/transaction.entity';
import { PaymentService } from './services/payment.service';
import { PaymentResultHandlerProviderFactory } from './factories/payment-result-handler-provider.factory';

// dtos
import { BusTicketPurchaseDto } from './dto/bus-ticket-purchase.dto';
import { VakifBankPaymentResultDto } from './dto/vakif-bank-payment-result.dto';
import { BiletAllPaymentResultDto } from './dto/biletall-payment-result.dto';

// decorators
import { ClientIp } from '@app/common/decorators';

// types
import { UUID } from '@app/common/types';
import { BusTicketSaleRequest } from '@app/modules/tickets/bus/services/biletall/types/biletall-sale-request.type';
import { PaymentResultQueryParams } from './types/payment-result-query-params.type';

// enums
import { PaymentProvider } from '@app/common/enums';
import { TransactionRequest } from './dto/get-transaction.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentResponseHandlerProviderFactory: PaymentResultHandlerProviderFactory,
  ) {}

  @Post('start-bus-ticket-payment')
  async startBusTicketPurchasePayment(
    @ClientIp() clientIp: string,
    @Body() busTicketPurchaseDto: BusTicketPurchaseDto,
  ): Promise<{ transactionId: string; htmlContent: string }> {
    const htmlContent = await this.paymentService.busTicketPurchase(
      clientIp,
      busTicketPurchaseDto,
    );
    return htmlContent;
  }

  @Post('start-plane-ticket-payment')
  startPlaneTicketPurchasePayment() {}

  @Post('start-hotel-reservation-payment')
  startHotelReservationPayment() {}

  @Post('transaction/:id')
  getTransactionData(
    @Param() { id }: TransactionRequest,
  ): Promise<Transaction> {
    return this.paymentService.getTransaction(id);
  }

  @Post('success')
  successfulPaymentHandler(
    @Req() request: Request,
    @ClientIp() clientIp: string,
    @Query()
    { provider, transactionId }: PaymentResultQueryParams,
  ): Promise<Transaction> {
    const body = request.body as unknown as
      | VakifBankPaymentResultDto
      | BusTicketSaleRequest;

    let dto: VakifBankPaymentResultDto | BiletAllPaymentResultDto;

    if (provider === PaymentProvider.BILET_ALL) {
      dto = new BiletAllPaymentResultDto(
        body as BusTicketSaleRequest,
        transactionId,
      );
    } else {
      dto = body as VakifBankPaymentResultDto;
    }

    const paymentResultHandlerStrategy =
      this.paymentResponseHandlerProviderFactory.getStrategy(provider);

    return paymentResultHandlerStrategy.handleSuccessfulPayment(clientIp, dto);
  }

  @Post('failure')
  async failedPaymentHandler(
    @Req() request: Request,
    @Query()
    { provider, transactionId: transactionIdQuery }: PaymentResultQueryParams,
  ) {
    let body = request.body as unknown as
      | VakifBankPaymentResultDto
      | BusTicketSaleRequest;

    let transactionId: UUID | undefined = undefined;
    let errorMessage: string | undefined = undefined;

    if (provider === PaymentProvider.BILET_ALL) {
      body = body as unknown as BusTicketSaleRequest;
      transactionId = transactionIdQuery;
      errorMessage = body.Hata;
    } else {
      body = body as unknown as VakifBankPaymentResultDto;
      transactionId = body.VerifyEnrollmentRequestId;
      errorMessage = body.ErrorMessage;
    }

    const paymentResultHandlerStrategy =
      this.paymentResponseHandlerProviderFactory.getStrategy(provider);
    await paymentResultHandlerStrategy.handleFailedPayment(
      transactionId,
      errorMessage,
    );
    throw new BadRequestException(errorMessage);
  }
}
