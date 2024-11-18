import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { DateISODate } from '@app/common/types';

@Entity('passports')
export class Passport extends AbstractEntity<Passport> {
  @Column()
  number: string;

  @Column()
  country: string;

  @Column({ type: 'date' })
  expirationDate: DateISODate;
}
