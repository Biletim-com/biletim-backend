import {
  Get,
  Post,
  Controller,
  Body,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// entites
import { User } from '@app/modules/users/user.entity';

// services
import { OrderReturnValidationService } from './services/order-return-validation.service';
import { OrderReturnStartService } from './services/order-return-start.service';
import { OrderReturnFinishService } from './services/order-return-finish.service';

// dto
import { OrderReturnStartRequestDto } from './dto/order-return-start-request.dto';
import { OrderReturnFinishRequestDto } from './dto/order-return-finish-request.dto';
import { OrderReturnValidationRequestDto } from './dto/order-return-validation-request.dto';
import { OrderReturnValidationDto } from './dto/order-return-validation.dto';

// decorators
import { ClientIp, CurrentUser } from '@app/common/decorators';

// interseptors
import { UserInterceptor } from '@app/common/interceptors';

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

  @UseInterceptors(UserInterceptor)
  @Post('finish')
  async finishOrderReturn(
    @ClientIp() clientIp: string,
    @Body()
    {
      reservationNumber,
      passengerLastName,
      orderType,
      verificationCode,
      returnToWallet,
    }: OrderReturnFinishRequestDto,
    @CurrentUser() user?: User,
  ): Promise<{ message: string }> {
    await this.orderReturnFinishService.finishReturn(
      clientIp,
      reservationNumber,
      passengerLastName,
      orderType,
      verificationCode,
      returnToWallet,
      user,
    );
    return { message: 'Order Cancellation is successful' };
  }
}
