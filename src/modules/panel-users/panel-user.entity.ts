import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

@Entity('panel_users')
export class PanelUser extends AbstractEntity<PanelUser> {
  @Column()
  name: string;

  @Column()
  familyName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: Nullable<string>;

  @Column({ type: 'varchar', nullable: true })
  address?: Nullable<string>;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isSuperAdmin: boolean;
}
