import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { PlaneTicketSegment } from './plane-ticket-segment.entity';
import { Order } from '@app/modules/orders/order.entity';

// enums
import { Gender, PassengerType } from '@app/common/enums';

// types
import { DateISODate } from '@app/common/types';

@Entity('plane_tickets')
export class PlaneTicket extends AbstractEntity<PlaneTicket> {
  @Column()
  companyNo: string;

  @Column()
  companyName: string;

  @Column()
  ticketOrder: number;

  @Column('varchar', { nullable: true })
  ticketNumber?: Nullable<string>;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('varchar')
  gender: Gender;

  @Column('varchar')
  passengerType: PassengerType;

  @Column('date')
  birthday: DateISODate;

  @Column('varchar', { nullable: true, length: 11 })
  tcNumber?: Nullable<string>;

  @Column('varchar', { nullable: true })
  passportCountryCode?: Nullable<string>;

  @Column('varchar', { nullable: true })
  passportNumber?: Nullable<string>;

  @Column('date', { nullable: true })
  passportExpirationDate?: Nullable<DateISODate>;

  @Column()
  netPrice: string;

  @Column()
  taxAmount: string;

  @Column()
  serviceFee: string;

  @Column()
  biletimFee: string;

  @ManyToMany(() => PlaneTicketSegment)
  segments: PlaneTicketSegment[];

  @JoinColumn()
  @ManyToOne(() => Order, (order) => order.planeTicket, {
    onDelete: 'SET NULL',
  })
  order: Order;
}
