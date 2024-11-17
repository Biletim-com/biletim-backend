import {
  Body,
  Controller,
  Post,
  Query,
  Req,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Transaction } from '@app/modules/transactions/transaction.entity';
import { PaymentService } from './services/payment.service';
import { BusTicketPaymentService } from './services/bus-ticket-payment.service';
import { PlaneTicketPaymentService } from './services/plane-ticket-payment.service';
import { PaymentResultHandlerProviderFactory } from './factories/payment-result-handler-provider.factory';
import { HtmlTemplateService } from './services/html-template.service';

// dtos
import { BusTicketPurchaseDto } from './dto/bus-ticket-purchase.dto';
import { VakifBankPaymentResultDto } from './dto/vakif-bank-payment-result.dto';
import { BiletAllPaymentResultDto } from './dto/biletall-payment-result.dto';
import { PlaneTicketPurchaseDto } from './dto/plane-ticket-purchase.dto';

// decorators
import { ClientIp } from '@app/common/decorators';

// types
import { UUID } from '@app/common/types';
import { BusTicketSaleRequest } from '@app/modules/tickets/bus/services/biletall/types/biletall-sale-request.type';
import { PaymentResultQueryParams } from './types/payment-result-query-params.type';
import type { Response, Request } from 'express';

// enums
import { PaymentProvider, TicketType } from '@app/common/enums';
import { TransactionRequest } from './dto/get-transaction.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly busTicketPaymentService: BusTicketPaymentService,
    private readonly planeTicketPaymentService: PlaneTicketPaymentService,
    private readonly paymentResponseHandlerProviderFactory: PaymentResultHandlerProviderFactory,
    private readonly htmlTemplateService: HtmlTemplateService,
  ) {}

  @Post('start-bus-ticket-payment')
  async startBusTicketPurchasePayment(
    @ClientIp() clientIp: string,
    @Body() busTicketPurchaseDto: BusTicketPurchaseDto,
  ): Promise<{ transactionId: string; htmlContent: string }> {
    const { transactionId, htmlContent } =
      await this.busTicketPaymentService.busTicketPurchase(
        clientIp,
        busTicketPurchaseDto,
      );
    const base64HtmlContent = Buffer.from(htmlContent).toString('base64');
    return { transactionId, htmlContent: base64HtmlContent };
  }

  @Post('start-plane-ticket-payment')
  async startPlaneTicketPurchasePayment(
    @ClientIp() clientIp: string,
    @Body() planeTicketPurchaseDto: PlaneTicketPurchaseDto,
  ): Promise<{ transactionId: string; htmlContent: string }> {
    const { transactionId, htmlContent } =
      await this.planeTicketPaymentService.startPlaneTicketPurchase(
        clientIp,
        planeTicketPurchaseDto,
      );
    const base64HtmlContent = Buffer.from(htmlContent).toString('base64');
    return { transactionId, htmlContent: base64HtmlContent };
  }

  @Post('start-hotel-reservation-payment')
  startHotelReservationPayment() {}

  @Get('transaction/:id')
  getTransactionData(
    @Param() { id }: TransactionRequest,
  ): Promise<Transaction> {
    return this.paymentService.getTransaction(id);
  }

  @Post('success')
  async successfulPaymentHandler(
    @Req() request: Request,
    @Res() res: Response,
    @ClientIp() clientIp: string,
    @Query()
    { provider, transactionId, ticketType }: PaymentResultQueryParams,
  ): Promise<void> {
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

    try {
      // TODO: think about applying strategy pattern to this
      if (ticketType === TicketType.BUS) {
        await paymentResultHandlerStrategy.handleSuccessfulBusTicketPayment(
          clientIp,
          dto,
        );
      } else {
        await paymentResultHandlerStrategy.handleSuccessfulPlaneTicketPayment(
          clientIp,
          dto,
        );
      }

      const htmlString = await this.htmlTemplateService.renderTemplate(
        'payment-response',
        {},
      );
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlString);
    } catch (err) {
      const errorMessage = err.message || 'Something went wrong';
      const htmlString = await this.htmlTemplateService.renderTemplate(
        'payment-response',
        { errorMessage },
      );
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlString);
    }
  }

  @Post('failure')
  async failedPaymentHandler(
    @Req() request: Request,
    @Res() res: Response,
    @Query()
    { provider, transactionId: transactionIdQuery }: PaymentResultQueryParams,
  ): Promise<void> {
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
    paymentResultHandlerStrategy.handleFailedPayment(
      transactionId,
      errorMessage,
    );

    const htmlString = await this.htmlTemplateService.renderTemplate(
      'payment-response',
      { errorMessage },
    );
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlString);
  }
}
