import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

@Entity('panel_users')
export class PanelUser extends AbstractEntity<PanelUser> {
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

  @Column({ name: 'is_super_admin', default: false })
  isSuperAdmin: boolean;
}
