import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { Gender, PassengerType } from '@app/common/enums';
import { DateISODate } from '@app/common/types';

@Entity('plane_ticket_passengers')
export class PlaneTicketPassenger extends AbstractEntity<PlaneTicketPassenger> {
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
}
