import { Entity, Column, OneToOne } from 'typeorm';

import { BaseEntity } from '@app/common/database/entities/base.entity';

import { Verification } from './verification/verification.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'family_name' })
  familyName: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'forgot_password_code', type: 'uuid', nullable: true })
  forgotPasswordCode?: string;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @OneToOne(() => Verification, (verification) => verification.user)
  verification: Verification;
}
