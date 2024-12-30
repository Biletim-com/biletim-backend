import { UUID } from '@app/common/types';
import { PlaneTicketOrder } from './entities/plane-ticket-order.entity';
import { PlaneTicketOrdersRepository } from './plane-ticket-orders.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlaneTicketOrderService {
  constructor(
    private readonly planeTicketOrdersRepository: PlaneTicketOrdersRepository,
  ) {}

  async getPlaneTravelsOfUser(
    userId: UUID,
  ): Promise<PlaneTicketOrder[] | PlaneTicketOrder> {
    return this.planeTicketOrdersRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
        tickets: {
          passenger: true,
        },
        segments: {
          departureAirport: true,
          arrivalAirport: true,
        },
        transaction: true,
      },
    });
  }
}
