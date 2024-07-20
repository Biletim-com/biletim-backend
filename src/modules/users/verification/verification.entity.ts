import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '@app/common/database/entities/base.entity';

import { User } from '../user.entity';

@Entity('verification')
export class Verification extends BaseEntity {
  @Column({ name: 'verification_code' })
  verificationCode: number;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @Column({ name: 'is_expired', default: false })
  isExpired: boolean;

  @OneToOne(() => User, (user) => user.verification)
  @JoinColumn()
  user: User;
}
