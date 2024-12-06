import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { Gender } from '@app/common/enums';
import { DateISODate } from '@app/common/types';

import { User } from '../users/user.entity';
import { Passport } from './passports/passport.entity';

@Entity('passengers')
export class Passenger extends AbstractEntity<Passenger> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar' })
  gender: Gender;

  @Column({ type: 'date' })
  birthday: DateISODate;

  @Column({ type: 'varchar', length: 11 })
  tcNumber: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  phoneNumber: string;

  @ManyToOne(() => User, (user) => user.passengers, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => Passport, (passport) => passport.passenger, {
    cascade: ['insert', 'update'],
  })
  passports: Passport[];
}
