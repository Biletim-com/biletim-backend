import { Injectable } from '@nestjs/common';

// entities
import { BusTicketOrder } from '@app/modules/orders/bus-ticket/entities/bus-ticket-order.entity';
import { PlaneTicketOrder } from '@app/modules/orders/plane-ticket/entities/plane-ticket-order.entity';
import { HotelBookingOrder } from '@app/modules/orders/hotel-booking/entities/hotel-booking-order.entity';

// enums
import { OrderType } from '@app/common/enums';

// errors
import { ServiceError } from '@app/common/errors';

type OrderEntityMap = {
  [OrderType.BUS_TICKET]: typeof BusTicketOrder;
  [OrderType.PLANE_TICKET]: typeof PlaneTicketOrder;
  [OrderType.HOTEL_BOOKING]: typeof HotelBookingOrder;
};

@Injectable()
export class OrderEntityFactoryService {
  private readonly entityMap: Map<OrderType, OrderEntityMap[OrderType]>;

  constructor() {
    this.entityMap = new Map<OrderType, OrderEntityMap[OrderType]>([
      [OrderType.BUS_TICKET, BusTicketOrder],
      [OrderType.PLANE_TICKET, PlaneTicketOrder],
      [OrderType.HOTEL_BOOKING, HotelBookingOrder],
    ]);
  }

  getEntity<T extends OrderType>(orderType: T): OrderEntityMap[T] {
    const entityClass = this.entityMap.get(orderType);
    if (!entityClass) {
      throw new ServiceError(`Unsupported order type: ${orderType}`);
    }
    return entityClass as OrderEntityMap[T];
  }
}
