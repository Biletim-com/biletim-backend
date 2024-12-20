import { Column, Entity, OneToOne } from 'typeorm';

// entities
import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { BusTicketOrder } from '../orders/bus-ticket/entities/bus-ticket-order.entity';
import { HotelBookingOrder } from '../orders/hotel-booking/entities/hotel-booking-order.entity';
import { PlaneTicketOrder } from '../orders/plane-ticket/entities/plane-ticket-order.entity';

// enums
import { InvoiceType } from '@app/common/enums';

@Entity('invoices')
export class Invoice extends AbstractEntity<Invoice> {
  @Column('varchar')
  type: InvoiceType;

  @Column('varchar', { nullable: true })
  pnr?: Nullable<string>;

  @Column()
  recipientName: string;

  @Column()
  identifier: string;

  @Column()
  address: string;

  @Column('varchar', { nullable: true })
  taxOffice?: Nullable<string>;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @OneToOne(() => BusTicketOrder, (busTicketOrder) => busTicketOrder.invoice)
  busTicketOrder: BusTicketOrder;

  @OneToOne(
    () => HotelBookingOrder,
    (hotelBookingOrder) => hotelBookingOrder.invoice,
  )
  hotelBookingOrder: HotelBookingOrder;

  @OneToOne(
    () => PlaneTicketOrder,
    (planeTicketOrder) => planeTicketOrder.invoice,
  )
  planeTicketOrder: PlaneTicketOrder;
}
