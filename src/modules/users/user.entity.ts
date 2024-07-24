import { Entity, Column, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { Verification } from './verification/verification.entity';

@Entity('users')
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column({ name: 'family_name' })
  familyName: string;

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

  @OneToOne(() => Verification, (verification) => verification.user, {
    cascade: ['insert', 'update'],
  })
  verification: Verification;
}
