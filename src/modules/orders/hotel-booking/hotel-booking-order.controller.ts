import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { CurrentUser } from '@app/common/decorators';
import { User } from '@app/modules/users/user.entity';
import { HotelBookingOrderService } from './hotel-booking-order.service';
import { HotelBookingOrder } from './entities/hotel-booking-order.entity';

@ApiTags('Orders')
@ApiCookieAuth()
@Controller('orders/hotel-bookings')
export class HotelBookingOrderController {
  constructor(
    private readonly hotelBookingOrderService: HotelBookingOrderService,
  ) {}

  @ApiOperation({ summary: 'Get Hotel Travels of User' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getHotelTravelsOfUser(
    @CurrentUser() user: User,
  ): Promise<HotelBookingOrder[] | HotelBookingOrder> {
    return this.hotelBookingOrderService.getHotelTravelsOfUser(user.id);
  }
}
