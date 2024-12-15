import { Entity, OneToOne, JoinColumn, Column, OneToMany } from 'typeorm';

// entities
import { AbstractOrder } from './abstract-order.entity';
import { HotelBookingRoom } from './hotel-booking-room.entity';
import { Invoice } from '@app/modules/invoices/invoice.entity';

// dto
import {
  OrderUpsellData,
  PaymentType,
} from '@app/providers/hotel/ratehawk/dto/hotel-booking-finish.dto';

@Entity('hotel_booking_orders')
export class HotelBookingOrder extends AbstractOrder<HotelBookingOrder> {
  @Column('jsonb')
  upsell: OrderUpsellData[];

  @Column('jsonb')
  paymentType: PaymentType;

  @Column({
    type: 'bigint',
    default: () => `nextval('reservation_number_seq')`,
    unique: true,
  })
  reservationNumber: number;

  @OneToMany(
    () => HotelBookingRoom,
    (hotelBookingRoom) => hotelBookingRoom.order,
  )
  rooms: HotelBookingRoom[];

  @JoinColumn()
  @OneToOne(() => Invoice, (invoice) => invoice.order, {
    cascade: ['insert'],
  })
  invoice: Invoice;
}
