import { Injectable } from '@nestjs/common';

// repositories
import { BusTicketOrdersRepository } from '@app/modules/orders/bus-ticket/bus-ticket-orders.repository';
import { PlaneTicketOrdersRepository } from '@app/modules/orders/plane-ticket/plane-ticket-orders.repository';
import { HotelBookingOrdersRepository } from '@app/modules/orders/hotel-booking/hotel-booking-orders.repository';

// enums
import { OrderType } from '@app/common/enums';

// errors
import { ServiceError } from '@app/common/errors';

type OrderRepositoryMap = {
  [OrderType.BUS_TICKET]: BusTicketOrdersRepository;
  [OrderType.PLANE_TICKET]: PlaneTicketOrdersRepository;
  [OrderType.HOTEL_BOOKING]: HotelBookingOrdersRepository;
};

@Injectable()
export class OrderRepositoryFactoryService {
  private readonly repositoryMap: Map<
    OrderType,
    | BusTicketOrdersRepository
    | PlaneTicketOrdersRepository
    | HotelBookingOrdersRepository
  >;

  constructor(
    private readonly busTicketOrdersRepository: BusTicketOrdersRepository,
    private readonly planeTicketOrdersRepository: PlaneTicketOrdersRepository,
    private readonly hotelBookingOrdersRepository: HotelBookingOrdersRepository,
  ) {
    this.repositoryMap = new Map<OrderType, OrderRepositoryMap[OrderType]>([
      [OrderType.BUS_TICKET, this.busTicketOrdersRepository],
      [OrderType.PLANE_TICKET, this.planeTicketOrdersRepository],
      [OrderType.HOTEL_BOOKING, this.hotelBookingOrdersRepository],
    ]);
  }

  getRepository<T extends OrderType>(orderType: T): OrderRepositoryMap[T] {
    const repository = this.repositoryMap.get(orderType);
    if (!repository) {
      throw new ServiceError(`Unsupported order type: ${orderType}`);
    }
    // conditional types ensures type safety
    return repository as any;
  }
}
