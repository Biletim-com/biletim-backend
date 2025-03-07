import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DateTime, UUID } from '@app/common/types';

const UtcDateTransformer = {
  from: (value: string) => new Date(`${value}Z`),
  to: (value: Date) => value, // Stores as-is
};

export abstract class AbstractEntity<Entity> {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @CreateDateColumn({ type: 'timestamp', transformer: UtcDateTransformer })
  createdAt: DateTime;

  @UpdateDateColumn({ type: 'timestamp', transformer: UtcDateTransformer })
  updatedAt: DateTime;

  constructor(entity: Partial<Entity>) {
    Object.assign(this, entity);
  }
}
