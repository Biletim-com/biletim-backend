import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// dtos
import { BusTicketPurchaseDto } from '@app/common/dtos';
import { PaymentResultDto } from './dto/payment-result.dto';

// types
import type { Response } from 'express';
import { PaymentService } from './services/payment.service';
import { PaymentResponseHandlerService } from './services/payment-response-handler.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly patmentService: PaymentService,
    private readonly paymentResponseHandlerService: PaymentResponseHandlerService,
  ) {}

  @Post('start-bus-ticket-payment')
  async startBusTicketPurchasePayment(
    @Res() response: Response,
    @Body() busTicketPurchaseDto: BusTicketPurchaseDto,
  ): Promise<string> {
    const htmlContent = await this.patmentService.busTicketPurchase(
      busTicketPurchaseDto,
    );
    response.setHeader('Content-Type', 'text/html');
    response.send(htmlContent);
    return htmlContent;
  }

  @Post('start-plane-ticket-payment')
  startPlaneTicketPurchasePayment() {}

  @Post('start-hotel-reservation-payment')
  startHotelReservationPayment() {}

  // handlers
  @Post('success')
  successfulPaymentHandler(
    @Req() request: Request,
    @Body() paymentResultDto: PaymentResultDto,
  ) {
    return this.paymentResponseHandlerService.handleSuccessfulPayment(
      paymentResultDto,
    );
  }

  @Post('failure')
  failedPaymentHandler() {}
}
