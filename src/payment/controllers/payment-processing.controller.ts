import { Controller, Logger, Post, Query, Req, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

// services
import { HtmlTemplateService } from '@app/providers/html-template/provider.service';
import { PaymentProcessingService } from '../services/payment-processing.service';

// dtos
import { VakifBankPaymentResultDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

// decorators
import { ClientIp } from '@app/common/decorators';

// types
import type { Response, Request } from 'express';
import { PaymentResultQueryParams } from '../types/payment-result-query-params.type';
import { BusTicketPurchaseResult } from '@app/providers/ticket/biletall/bus/types/biletall-bus-ticket-purchase-result.type';

@ApiExcludeController()
@Controller('payment')
export class PaymentProcessingController {
  private readonly logger = new Logger(PaymentProcessingController.name);

  constructor(
    private readonly htmlTemplateService: HtmlTemplateService,
    private readonly paymentProcessingService: PaymentProcessingService,
  ) {}

  @Post('success')
  async successfulPaymentHandler(
    @Req()
    req: Request<any, any, VakifBankPaymentResultDto | BusTicketPurchaseResult>,
    @Res() res: Response,
    @ClientIp() clientIp: string,
    @Query()
    {
      transactionId: transactionIdQuery,
      paymentFlowType,
    }: PaymentResultQueryParams,
  ): Promise<void> {
    try {
      await this.paymentProcessingService.processPayment(
        clientIp,
        transactionIdQuery,
        paymentFlowType,
        req.body,
      );
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
    @Req() req: Request,
    @Res() res: Response,
    @Query()
    { transactionId, paymentFlowType }: PaymentResultQueryParams,
  ): Promise<void> {
    const errorMessage = this.paymentProcessingService.failPayment(
      transactionId,
      paymentFlowType,
      req.body,
    );

    const htmlString = await this.htmlTemplateService.renderTemplate(
      'payment-response',
      { errorMessage },
    );
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlString);
  }
}
