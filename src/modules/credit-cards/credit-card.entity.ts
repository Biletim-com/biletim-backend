import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { User } from '../users/user.entity';

import { DateISODate } from '@app/common/types';

@Entity('credit_cards')
export class CreditCard extends AbstractEntity<CreditCard> {
  @Column()
  name: string;

  @Column()
  hash: string;

  @Column()
  maskedPan: string;

  @Column()
  panToken: string;

  @Column('date')
  expiryDate: DateISODate;

  @Column()
  holderName: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
