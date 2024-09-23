import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { Gender } from '@app/common/enums';
import { DateTime } from '@app/common/types';

import { User } from '../users/user.entity';
import { Passport } from './passports/passport.entity';

@Entity('passengers')
export class Passenger extends AbstractEntity<Passenger> {
  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  middleName?: Nullable<string>;

  @Column()
  familyName: string;

  @Column({ type: 'varchar' })
  gender: Gender;

  @Column({ type: 'varchar', nullable: true })
  email?: Nullable<string>;

  @Column({ type: 'varchar', nullable: true })
  phone?: Nullable<string>;

  @Column({ type: 'timestamp', nullable: true })
  birthday?: Nullable<DateTime>;

  @Column({ type: 'varchar', length: 11 })
  tcNumber?: Nullable<string>;

  @ManyToOne(() => User, (user) => user.passengers, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToOne(() => Passport, (passport) => passport.id, {
    cascade: ['insert', 'update'],
    nullable: true,
  })
  @JoinColumn()
  passport?: Nullable<Passport>;
}
