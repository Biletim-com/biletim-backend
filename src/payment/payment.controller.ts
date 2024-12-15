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
import { PaymentResultService } from './services/payment-result.service';
import { BusTicketStartPaymentService } from './services/bus-ticket-start-payment.service';
import { PlaneTicketStartPaymentService } from './services/plane-ticket-start-payment.service';
import { PaymentResultHandlerProviderFactory } from './factories/payment-result-handler-provider.factory';
import { HtmlTemplateService } from '@app/providers/html-template/provider.service';
import { HotelBookingStartPaymentService } from './services/hotel-booking-start-payment.service';

// dtos
import { BusTicketPurchaseDto } from './dto/bus-ticket-purchase.dto';
import { VakifBankPaymentResultDto } from './dto/vakif-bank-payment-result.dto';
import { BiletAllPaymentResultDto } from './dto/biletall-payment-result.dto';
import { PlaneTicketPurchaseDto } from './dto/plane-ticket-purchase.dto';
import { HotelBookingPurchaseDto } from './dto/hotel-booking-purchase.dto';

// decorators
import { ClientIp } from '@app/common/decorators';

// types
import type { Response, Request } from 'express';
import { UUID } from '@app/common/types';
import { PaymentResultQueryParams } from './types/payment-result-query-params.type';
import { BusTicketPurchaseRequest } from '@app/providers/ticket/biletall/bus/types/biletall-bus-ticket-purchase.type';

// enums
import { PaymentProvider, TicketType } from '@app/common/enums';
import { TransactionRequest } from './dto/get-transaction.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentResultService: PaymentResultService,
    private readonly busTicketStartPaymentService: BusTicketStartPaymentService,
    private readonly planeTicketStartPaymentService: PlaneTicketStartPaymentService,
    private readonly hotelBookingStartPaymentService: HotelBookingStartPaymentService,
    private readonly paymentResponseHandlerProviderFactory: PaymentResultHandlerProviderFactory,
    private readonly htmlTemplateService: HtmlTemplateService,
  ) {}

  @Post('start-bus-ticket-payment')
  async startBusTicketPurchasePayment(
    @ClientIp() clientIp: string,
    @Body() busTicketPurchaseDto: BusTicketPurchaseDto,
  ): Promise<{ transactionId: string; htmlContent: string }> {
    const { transactionId, htmlContent } =
      await this.busTicketStartPaymentService.busTicketPurchase(
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
      await this.planeTicketStartPaymentService.startPlaneTicketPurchase(
        clientIp,
        planeTicketPurchaseDto,
      );
    const base64HtmlContent = Buffer.from(htmlContent).toString('base64');
    return { transactionId, htmlContent: base64HtmlContent };
  }

  @Post('start-hotel-booking-payment')
  async startHotelReservationPayment(
    @ClientIp() clientIp: string,
    @Body() hotelBookingPurchaseDto: HotelBookingPurchaseDto,
  ) {
    const { transactionId, htmlContent } =
      await this.hotelBookingStartPaymentService.startHotelBookingOrderPayment(
        clientIp,
        hotelBookingPurchaseDto,
      );
    const base64HtmlContent = Buffer.from(htmlContent).toString('base64');
    return { transactionId, htmlContent: base64HtmlContent };
  }

  @Get('transaction/:id')
  getTransactionData(
    @Param() { id }: TransactionRequest,
  ): Promise<Transaction> {
    return this.paymentResultService.getTransaction(id);
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
      | BusTicketPurchaseRequest;

    let dto: VakifBankPaymentResultDto | BiletAllPaymentResultDto;

    if (provider === PaymentProvider.BILET_ALL) {
      dto = new BiletAllPaymentResultDto(
        body as BusTicketPurchaseRequest,
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
      } else if (ticketType === TicketType.PLANE) {
        await paymentResultHandlerStrategy.handleSuccessfulPlaneTicketPayment(
          clientIp,
          dto,
        );
      } else {
        await paymentResultHandlerStrategy.handleSuccessfulHotelBookingPayment(
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
      | BusTicketPurchaseRequest;

    let transactionId: UUID | undefined = undefined;
    let errorMessage: string | undefined = undefined;

    if (provider === PaymentProvider.BILET_ALL) {
      body = body as unknown as BusTicketPurchaseRequest;
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
