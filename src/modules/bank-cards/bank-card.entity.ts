import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { User } from '../users/user.entity';

import { DateISODate } from '@app/common/types';

@Entity('bank_cards')
export class BankCard extends AbstractEntity<BankCard> {
  @Column()
  name: string;

  @Column()
  hash: string;

  @Column()
  maskedPan: string;

  @Column()
  vakifPanToken: string;

  @Column()
  garantiPanToken: string;

  @Column()
  ratehawkPanToken: string;

  @Column('date')
  expiryDate: DateISODate;

  @Column()
  holderName: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;
}
