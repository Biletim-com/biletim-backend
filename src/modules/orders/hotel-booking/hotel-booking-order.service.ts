import { UUID } from '@app/common/types';
import { HotelBookingOrdersRepository } from './hotel-booking-orders.repository';
import { HotelBookingOrder } from './entities/hotel-booking-order.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HotelBookingOrderService {
  constructor(
    private readonly hotelBookingOrdersRepository: HotelBookingOrdersRepository,
  ) {}

  async getHotelTravelsOfUser(
    userId: UUID,
  ): Promise<HotelBookingOrder[] | HotelBookingOrder> {
    return this.hotelBookingOrdersRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
        rooms: {
          guests: true,
        },
        transaction: true,
      },
    });
  }
}
