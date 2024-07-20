import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UUIDv4 } from '@app/common/types';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDv4;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
  })
  udpatedAt: Date;
}
