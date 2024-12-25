import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

// entities
import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { User } from '../users/user.entity';

// types
import { DateISODate } from '@app/common/types';

// enums
import { BankCardType } from '@app/common/enums';

// utils
import { identifyBankCardType } from '@app/common/utils';

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

  @Column('date')
  expiryDate: DateISODate;

  @Column()
  holderName: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.bankCards, { onDelete: 'CASCADE' })
  user: User;

  get cardType(): BankCardType {
    return identifyBankCardType(this.maskedPan);
  }
}
