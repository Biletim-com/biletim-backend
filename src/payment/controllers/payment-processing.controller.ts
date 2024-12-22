import { Controller, Post, Query, Req, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

// services
import { HtmlTemplateService } from '@app/providers/html-template/provider.service';

// factories
import { PaymentProcessingFactory } from '../factories/payment-processing.factory';

// dtos
import { BusTicketPurchaseResultDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-purchase-result.dto';
import { VakifBankPaymentResultDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

// decorators
import { ClientIp } from '@app/common/decorators';

// types
import type { Response, Request } from 'express';
import { UUID } from '@app/common/types';
import { PaymentResultQueryParams } from '../types/payment-result-query-params.type';
import { BusTicketPurchaseResult } from '@app/providers/ticket/biletall/bus/types/biletall-bus-ticket-purchase-result.type';

// enums
import { PaymentProvider } from '@app/common/enums';

@ApiExcludeController()
@Controller('payment')
export class PaymentProcessingController {
  constructor(
    private readonly paymentProcessingFactory: PaymentProcessingFactory,
    private readonly htmlTemplateService: HtmlTemplateService,
  ) {}

  @Post('success')
  async successfulPaymentHandler(
    @Req() request: Request,
    @Res() res: Response,
    @ClientIp() clientIp: string,
    @Query()
    {
      provider,
      transactionId: transactionIdQuery,
      ticketType,
    }: PaymentResultQueryParams,
  ): Promise<void> {
    const body = request.body as unknown as
      | VakifBankPaymentResultDto
      | BusTicketPurchaseResult;

    let transactionId: UUID | undefined = undefined;
    let paymentResultDto:
      | VakifBankPaymentResultDto
      | BusTicketPurchaseResultDto;

    if (provider === PaymentProvider.BILET_ALL) {
      paymentResultDto = new BusTicketPurchaseResultDto(
        body as BusTicketPurchaseResult,
      );
      transactionId = transactionIdQuery;
    } else {
      paymentResultDto = body as VakifBankPaymentResultDto;
      transactionId = paymentResultDto.VerifyEnrollmentRequestId;
    }

    const paymentProcessingStrategy =
      this.paymentProcessingFactory.getStrategy(ticketType);

    try {
      await paymentProcessingStrategy.handlePayment(clientIp, transactionId, {
        provider,
        details: paymentResultDto,
      });
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
    {
      provider,
      transactionId: transactionIdQuery,
      ticketType,
    }: PaymentResultQueryParams,
  ): Promise<void> {
    let body = request.body as unknown as
      | VakifBankPaymentResultDto
      | BusTicketPurchaseResult;

    let transactionId: UUID | undefined = undefined;
    let errorMessage: string | undefined = undefined;

    if (provider === PaymentProvider.BILET_ALL) {
      body = body as unknown as BusTicketPurchaseResult;
      transactionId = transactionIdQuery;
      errorMessage = body.Hata;
    } else {
      body = body as unknown as VakifBankPaymentResultDto;
      transactionId = body.VerifyEnrollmentRequestId;
      errorMessage = body.ErrorMessage;
    }

    const paymentProcessingStrategy =
      this.paymentProcessingFactory.getStrategy(ticketType);
    paymentProcessingStrategy.handlePaymentFailure(transactionId, errorMessage);

    const htmlString = await this.htmlTemplateService.renderTemplate(
      'payment-response',
      { errorMessage },
    );
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlString);
  }
}
