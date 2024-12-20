import { Get, Post, Controller, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// services
import { OrderReturnValidationService } from './services/order-return-validation.service';
import { OrderReturnStartService } from './services/order-return-start.service';
import { OrderReturnFinishService } from './services/order-return-finish.service';

// decorators
import { ClientIp } from '@app/common/decorators';

// dto
import { OrderReturnStartRequestDto } from './dto/order-return-start-request.dto';
import { OrderReturnFinishRequestDto } from './dto/order-return-finish-request.dto';
import { OrderReturnValidationRequestDto } from './dto/order-return-validation-request.dto copy';
import { OrderReturnValidationDto } from './dto/order-return-validation.dto';

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
    @Query()
    {
      reservationNumber,
      passengerLastName,
      orderType,
    }: OrderReturnValidationRequestDto,
  ): Promise<OrderReturnValidationDto> {
    return this.orderReturnValidationService.validateOrder(
      reservationNumber,
      passengerLastName,
      orderType,
    );
  }

  @Post('start')
  async startOrderReturn(
    @Body()
    {
      reservationNumber,
      passengerLastName,
      orderType,
    }: OrderReturnStartRequestDto,
  ): Promise<{ message: string }> {
    await this.orderReturnStartService.startReturnOrder(
      reservationNumber,
      passengerLastName,
      orderType,
    );
    return { message: 'Order Cancellation message is sent' };
  }

  @Post('finish')
  async finishOrderReturn(
    @ClientIp() clientIp: string,
    @Body()
    {
      reservationNumber,
      passengerLastName,
      orderType,
      verificationCode,
    }: OrderReturnFinishRequestDto,
  ): Promise<{ message: string }> {
    await this.orderReturnFinishService.finishReturn(
      clientIp,
      reservationNumber,
      passengerLastName,
      orderType,
      verificationCode,
    );
    return { message: 'Order Cancellation is successful' };
  }
}
