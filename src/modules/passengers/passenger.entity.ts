import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { Gender } from '@app/common/enums';
import { DateTime } from '@app/common/types';

@Entity('users')
export class Passenger extends AbstractEntity<Passenger> {
  @Column()
  name: string;

  @Column('varchar', { nullable: true })
  middleName?: Nullable<string>;

  @Column()
  familyName: string;

  gender: Gender;

  @Column('varchar', { nullable: true })
  email?: Nullable<string>;

  @Column({ type: 'varchar', nullable: true })
  phone?: Nullable<string>;

  @Column({ type: 'timestamp', nullable: true })
  birthday?: Nullable<DateTime>;
}
