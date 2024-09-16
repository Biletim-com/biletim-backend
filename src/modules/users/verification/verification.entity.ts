import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { User } from '../user.entity';

@Entity('verifications')
export class Verification extends AbstractEntity<Verification> {
  @Column()
  verificationCode: number;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ default: false })
  isExpired: boolean;

  @OneToOne(() => User, (user) => user.verification)
  @JoinColumn()
  user: User;
}
