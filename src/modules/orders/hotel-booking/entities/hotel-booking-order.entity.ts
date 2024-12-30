import { Entity, OneToOne, JoinColumn, Column, OneToMany } from 'typeorm';

// entities
import { AbstractOrder } from '../../abstract-order.entity';
import { HotelBookingRoom } from './hotel-booking-room.entity';
import { Invoice } from '@app/modules/invoices/invoice.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';

// dto
import {
  OrderUpsellData,
  PaymentType,
} from '@app/providers/hotel/ratehawk/dto/hotel-booking-finish.dto';

// types
import { DateTime, DeepConvertKeysToCamel } from '@app/common/types';
import { CancellationPenalties } from '@app/providers/hotel/ratehawk/types/hotel-payment-type.type';

@Entity('hotel_booking_orders')
export class HotelBookingOrder extends AbstractOrder<HotelBookingOrder> {
  @Column('varchar')
  checkinDateTime: DateTime;

  @Column('varchar')
  checkoutDateTime: DateTime;

  @Column('jsonb')
  upsell: OrderUpsellData[];

  @Column('jsonb')
  paymentType: PaymentType;

  @Column('jsonb')
  cancellationPenalties: DeepConvertKeysToCamel<CancellationPenalties>;

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
  @OneToOne(() => Invoice, (invoice) => invoice.hotelBookingOrder, {
    cascade: ['insert'],
  })
  invoice: Invoice;

  @JoinColumn()
  @OneToOne(() => Transaction, (transaction) => transaction.hotelBookingOrder)
  transaction: Transaction;
}
