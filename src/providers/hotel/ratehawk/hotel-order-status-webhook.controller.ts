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

// services
import { HotelApiConfigService } from '@app/configs/hotel-api';
import { HotelBookingOrdersRepository } from '@app/modules/orders/repositories/hotel-booking-orders.repository';

// enums
import { OrderStatus } from '@app/common/enums';

// dto
import { HotelOrderStatusRequestDto } from './dto/hotel-order-status.dto';

// types
import type { Request } from 'express';

@Controller('/hotel/webhook')
export class HotelOrderStatusWebhookController {
  private readonly logger = new Logger(HotelOrderStatusWebhookController.name);

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
      console.log({ data, signature });
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
      throw new InternalServerErrorException('Internal server error');
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
