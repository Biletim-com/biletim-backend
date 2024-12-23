import { UUID } from '@app/common/types';
import { BusTicketOrdersRepository } from './bus-ticket-orders.repository';
import { BusTicketOrder } from './entities/bus-ticket-order.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BusTicketOrderService {
  constructor(
    private readonly busTicketOrdersRepository: BusTicketOrdersRepository,
  ) {}

  async getBusTravelsOfUser(
    userId: UUID,
  ): Promise<BusTicketOrder[] | BusTicketOrder> {
    return this.busTicketOrdersRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
        departureTerminal: true,
        arrivalTerminal: true,
        tickets: {
          passenger: true,
        },
        transaction: true,
      },
      select: {
        departureTerminal: {
          countryCode: true,
          region: true,
          name: true,
          isCenter: true,
        },
        arrivalTerminal: {
          countryCode: true,
          region: true,
          name: true,
          isCenter: true,
        },
      },
    });
  }
}
