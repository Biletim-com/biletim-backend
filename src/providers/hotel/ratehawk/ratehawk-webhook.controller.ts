import * as crypto from 'crypto';
import {
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

// services
import { HotelApiConfigService } from '@app/configs/hotel-api';
import { HotelBookingOrdersRepository } from '@app/modules/orders/hotel-booking/hotel-booking-orders.repository';

// enums
import { OrderStatus } from '@app/common/enums';

// dto
import { HotelOrderStatusRequestDto } from './dto/hotel-order-status.dto';

// types
import type { Request } from 'express';

@ApiExcludeController()
@Controller('/hotel/webhook')
export class RatehawkWebhookController {
  private readonly logger = new Logger(RatehawkWebhookController.name);

  constructor(
    private readonly hotelBookingOrdersRepository: HotelBookingOrdersRepository,
    private readonly hotelApiConfigService: HotelApiConfigService,
  ) {}

  @Post('order-status')
  @HttpCode(HttpStatus.OK)
  async handleOrderStatus(
    @Req() { body }: Request<object, any, HotelOrderStatusRequestDto>,
  ): Promise<void> {
    try {
      const { data, signature } = body;
      if (
        !this.verifySignature({
          apiKey: this.hotelApiConfigService.hotelApiPassword,
          timestamp: signature.timestamp,
          token: signature.token,
          signature: signature.signature,
        })
      ) {
        throw new UnauthorizedException('Invalid signature');
      }

      this.logger.log(`Received webhook payload: ${{ data, signature }}`);
      await this.hotelBookingOrdersRepository.update(
        { reservationNumber: Number(data.partner_order_id) },
        {
          status:
            data.status === 'completed'
              ? OrderStatus.COMPLETED
              : OrderStatus.REJECTED,
        },
      );
    } catch (error) {
      this.logger.error(`Error handling webhook: ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @Post('test-connection')
  @HttpCode(HttpStatus.OK)
  async testConnection(
    @Req() { body }: Request<object, any, HotelOrderStatusRequestDto>,
  ): Promise<void> {
    try {
      const { signature } = body;
      if (
        !this.verifySignature({
          apiKey: this.hotelApiConfigService.hotelApiPassword,
          timestamp: signature.timestamp,
          token: signature.token,
          signature: signature.signature,
        })
      ) {
        throw new UnauthorizedException('Invalid signature');
      }
    } catch (error) {
      this.logger.error(`Error testing webhook connection: ${error}`);
      throw new InternalServerErrorException();
    }
  }

  private verifySignature({ apiKey, timestamp, token, signature }) {
    const encodedToken = crypto
      .createHmac('sha256', apiKey)
      .update(String(timestamp).concat(token))
      .digest('hex');
    return encodedToken === signature;
  }
}
