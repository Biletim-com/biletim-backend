import { Entity, Column, Index } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

@Entity('bus_terminals')
export class BusTerminal extends AbstractEntity<BusTerminal> {
  @Column({ name: 'external_id', unique: true })
  externalId: number;

  @Column({ name: 'city_id' })
  cityId: number;

  @Column({ name: 'country_code' })
  countryCode: string;

  @Column({ type: 'varchar', nullable: true })
  region?: Nullable<string>;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description?: Nullable<string>;

  @Column({ name: 'is_center', default: false })
  isCenter: boolean;

  @Column({ name: 'affiliated_center_id' })
  affiliatedCenterId: number;

  @Index()
  @Column({ name: 'appear_in_search', default: true })
  appearInSearch: boolean;
}
