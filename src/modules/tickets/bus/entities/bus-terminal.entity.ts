import { Entity, Column, Index } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

@Entity('bus_terminals')
export class BusTerminal extends AbstractEntity<BusTerminal> {
  @Column({ unique: true })
  externalId: number;

  @Column()
  cityId: number;

  @Column()
  countryCode: string;

  @Column({ type: 'varchar', nullable: true })
  region?: Nullable<string>;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description?: Nullable<string>;

  @Column({ default: false })
  isCenter: boolean;

  @Column()
  affiliatedCenterId: number;

  @Index()
  @Column({ default: true })
  appearInSearch: boolean;

  // since TypeORM does support GIN indexes natively
  // it is decided to be added manually in the migration file
  // and ignored while synching
  @Index('name_text_idx', { synchronize: false })
  @Column({
    type: 'tsvector',
    nullable: true,
    select: false,
    generatedType: 'STORED',
    asExpression: `to_tsvector('simple', name)`,
  })
  private readonly nameText: string;
}
