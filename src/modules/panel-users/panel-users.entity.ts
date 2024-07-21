import { Entity, Column } from 'typeorm';

import { BaseEntity } from '@app/common/database/entities/base.entity';

@Entity('panel_user')
export class PanelUser extends BaseEntity {
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

  @Column({ name: 'is_super_admin', default: false })
  isSuperAdmin: boolean;
}
