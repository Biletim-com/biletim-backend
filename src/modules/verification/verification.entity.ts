import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { User } from '../users/user.entity';
import { DateTime } from '@app/common/types';
import { VerificationType } from '@app/common/enums/verification.enums';
import { BusTicketOrder } from '../orders/bus-ticket/entities/bus-ticket-order.entity';
import { PlaneTicketOrder } from '../orders/plane-ticket/entities/plane-ticket-order.entity';
import { HotelBookingOrder } from '../orders/hotel-booking/entities/hotel-booking-order.entity';

@Entity('verifications')
export class Verification extends AbstractEntity<Verification> {
  @Column()
  verificationCode: number;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp' })
  expiredAt: DateTime;

  @Column({ type: 'varchar' })
  type: VerificationType;

  @ManyToOne(() => User, (user) => user.verification, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user?: Nullable<User>;

  @ManyToOne(() => BusTicketOrder, (busTicketOrder) => busTicketOrder.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  busTicketOrder?: Nullable<BusTicketOrder>;

  @ManyToOne(
    () => PlaneTicketOrder,
    (planeTicketOrder) => planeTicketOrder.id,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn()
  planeTicketOrder?: Nullable<PlaneTicketOrder>;

  @ManyToOne(
    () => HotelBookingOrder,
    (hotelBookingOrder) => hotelBookingOrder.id,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn()
  hotelBookingOrder?: Nullable<HotelBookingOrder>;
}
