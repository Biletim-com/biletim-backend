import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { User } from '../users/user.entity';

import { DateTime } from '@app/common/types';
import { BankCardType } from '@app/common/enums';

@Entity('bank_cards')
export class BankCard extends AbstractEntity<BankCard> {
  @Column()
  name: string;

  @Column()
  cardToken: string;

  @Column()
  lastFourDigits: string;

  @Column()
  cardType: BankCardType;

  @Column('timestamp')
  expiryDate: DateTime;

  @Column()
  cardholderName: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
