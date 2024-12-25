import {
  Body,
  Controller,
  Post,
  Param,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { User } from '@app/modules/users/user.entity';

// services
import { TransactionStatusService } from '../services/transaction-status.service';
import { BusTicketStartPaymentService } from '../services/bus-ticket-start-payment.service';
import { PlaneTicketStartPaymentService } from '../services/plane-ticket-start-payment.service';
import { HotelBookingStartPaymentService } from '../services/hotel-booking-start-payment.service';

// dtos
import { TransactionRequest } from '../dto/get-transaction.dto';
import { BusTicketPurchaseDto } from '../dto/bus-ticket-purchase.dto';
import { PlaneTicketPurchaseDto } from '../dto/plane-ticket-purchase.dto';
import { HotelBookingPurchaseDto } from '../dto/hotel-booking-purchase.dto';

// decorators
import { ClientIp, CurrentUser } from '@app/common/decorators';

// interseptors
import { UserInterceptor } from '@app/common/interceptors';

@ApiTags('Payment')
@Controller('payment')
export class PaymentStartController {
  constructor(
    private readonly transactionStatusService: TransactionStatusService,
    private readonly busTicketStartPaymentService: BusTicketStartPaymentService,
    private readonly planeTicketStartPaymentService: PlaneTicketStartPaymentService,
    private readonly hotelBookingStartPaymentService: HotelBookingStartPaymentService,
  ) {}

  @Get('transaction/:id')
  getTransactionData(
    @Param() { id }: TransactionRequest,
  ): Promise<Transaction> {
    return this.transactionStatusService.getTransaction(id);
  }

  @UseInterceptors(UserInterceptor)
  @Post('start-bus-ticket-payment')
  async startBusTicketPurchasePayment(
    @Body() busTicketPurchaseDto: BusTicketPurchaseDto,
    @ClientIp() clientIp: string,
    @CurrentUser() user?: User,
  ): Promise<{ transactionId: string; htmlContent: string }> {
    const { transactionId, htmlContent } =
      await this.busTicketStartPaymentService.busTicketPurchase(
        busTicketPurchaseDto,
        clientIp,
        user,
      );

    const base64HtmlContent = Buffer.from(htmlContent).toString('base64');
    return { transactionId, htmlContent: base64HtmlContent };
  }

  @UseInterceptors(UserInterceptor)
  @Post('start-plane-ticket-payment')
  async startPlaneTicketPurchasePayment(
    @Body() planeTicketPurchaseDto: PlaneTicketPurchaseDto,
    @ClientIp() clientIp: string,
    @CurrentUser() user?: User,
  ): Promise<{ transactionId: string; htmlContent: string }> {
    const { transactionId, htmlContent } =
      await this.planeTicketStartPaymentService.startPlaneTicketPurchase(
        planeTicketPurchaseDto,
        clientIp,
        user,
      );
    const base64HtmlContent = Buffer.from(htmlContent).toString('base64');
    return { transactionId, htmlContent: base64HtmlContent };
  }

  @UseInterceptors(UserInterceptor)
  @Post('start-hotel-booking-payment')
  async startHotelReservationPayment(
    @Body() hotelBookingPurchaseDto: HotelBookingPurchaseDto,
    @ClientIp() clientIp: string,
    @CurrentUser() user?: User,
  ) {
    const { transactionId, htmlContent } =
      await this.hotelBookingStartPaymentService.startHotelBookingOrderPayment(
        hotelBookingPurchaseDto,
        clientIp,
        user,
      );
    const base64HtmlContent = Buffer.from(htmlContent).toString('base64');
    return { transactionId, htmlContent: base64HtmlContent };
  }
}
