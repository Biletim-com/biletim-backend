import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

@Entity('airport_points')
export class AirportPoints extends AbstractEntity<AirportPoints> {
  @Column({ name: 'country_code' })
  countryCode: string;

  @Column({ name: 'country_name' })
  countryName: string;

  @Column({ name: 'country_name_en' })
  countryNameEn: string;

  @Column({ name: 'city_code' })
  cityCode: string;

  @Column({ name: 'city_name' })
  cityName: string;

  @Column({ name: 'city_name_en' })
  cityNameEn: string;

  @Column({ name: 'airport_code', unique: true })
  airportCode: string;

  @Column({ name: 'airport_name' })
  airportName: string;

  @Column({ name: 'airport_name_en' })
  airportNameEn: string;

  @Column({ nullable: true, name: 'airport_region' })
  airportRegion?: string | null;

  @Column({ nullable: true, name: 'airport_region_en' })
  airportRegionEn?: string | null;
}
