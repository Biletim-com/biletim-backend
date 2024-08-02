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

  @Column({ nullable: true })
  region?: string | null;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string | null;

  @Column({ name: 'is_center', default: false })
  isCenter: boolean;

  @Column({ name: 'affiliated_center_id' })
  affiliatedCenterId: number;

  @Index()
  @Column({ name: 'appear_in_search', default: true })
  appearInSearch: boolean;
}
