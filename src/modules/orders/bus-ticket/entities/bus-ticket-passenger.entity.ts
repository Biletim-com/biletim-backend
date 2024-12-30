import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { Gender } from '@app/common/enums';
import { DateISODate, PassportCountryCode } from '@app/common/types';

@Entity('bus_ticket_passenger')
export class BusTicketPassenger extends AbstractEntity<BusTicketPassenger> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('varchar')
  gender: Gender;

  @Column('varchar', { nullable: true, length: 11 })
  tcNumber?: Nullable<string>;

  @Column('varchar', { nullable: true })
  passportCountryCode?: Nullable<PassportCountryCode>;

  @Column('varchar', { nullable: true })
  passportNumber?: Nullable<string>;

  @Column('date', { nullable: true })
  passportExpirationDate?: Nullable<DateISODate>;
}
