import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

@Entity('airports')
export class Airport extends AbstractEntity<Airport> {
  @Column()
  countryCode: string;

  @Column()
  countryName: string;

  @Column()
  countryNameEn: string;

  @Column()
  cityCode: string;

  @Column()
  cityName: string;

  @Column()
  cityNameEn: string;

  @Column({ unique: true })
  airportCode: string;

  @Column()
  airportName: string;

  @Column()
  airportNameEn: string;

  @Column({ type: 'varchar', nullable: true })
  airportRegion?: Nullable<string>;

  @Column({ type: 'varchar', nullable: true })
  airportRegionEn?: Nullable<string>;
}
