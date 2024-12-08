import { Get, Post, Controller, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// services
import { OrderReturnValidationService } from './services/order-return-validation.service';
import { OrderReturnStartService } from './services/order-return-start.service';
import { OrderReturnFinishService } from './services/order-return-finish.service';

// entites
import { Order } from '@app/modules/orders/order.entity';

// decorators
import { ClientIp } from '@app/common/decorators';

// dto
import { OrderReturnStartRequestDto } from './dto/order-return-start-request.dto';
import { OrderReturnFinishRequestDto } from './dto/order-return-finish-request.dto';
import { OrderReturnValidationRequestDto } from './dto/order-return-validation-request.dto copy';

@ApiTags('Order Return')
@Controller('order-return')
export class OrderReturnController {
  constructor(
    private readonly orderReturnValidationService: OrderReturnValidationService,
    private readonly orderReturnStartService: OrderReturnStartService,
    private readonly orderReturnFinishService: OrderReturnFinishService,
  ) {}

  @Get('validate')
  validateOrder(
    @Query() { pnrNumber, passengerLastName }: OrderReturnValidationRequestDto,
  ): Promise<Order> {
    return this.orderReturnValidationService.validateOrderWithPnrNumber(
      pnrNumber,
      passengerLastName,
    );
  }

  @Post('start')
  async startOrderReturn(
    @Body() { pnrNumber, passengerLastName }: OrderReturnStartRequestDto,
  ): Promise<{ message: string }> {
    await this.orderReturnStartService.startReturnOrder(
      pnrNumber,
      passengerLastName,
    );
    return { message: 'Order Cancellation message is sent' };
  }

  @Post('finish')
  async finishOrderReturn(
    @ClientIp() clientIp: string,
    @Body()
    {
      pnrNumber,
      passengerLastName,
      verificationCode,
    }: OrderReturnFinishRequestDto,
  ): Promise<{ message: string }> {
    await this.orderReturnFinishService.finishReturn(
      clientIp,
      pnrNumber,
      passengerLastName,
      verificationCode,
    );
    return { message: 'Order Cancellation is successful' };
  }
}
