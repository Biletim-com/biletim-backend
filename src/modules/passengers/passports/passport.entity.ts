import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { DateISODate } from '@app/common/types';
import { Passenger } from '../passenger.entity';

@Entity('passports')
export class Passport extends AbstractEntity<Passport> {
  @Column()
  number: string;

  @Column()
  country: string;

  @Column({ type: 'date' })
  expirationDate: DateISODate;

  @ManyToOne(() => Passenger, (passenger) => passenger.passports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  passenger: Passenger;
}
