import { Entity, Column, Index } from 'typeorm';

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

  // Full-text search column for cityName, cityNameEn, airportCode, airportName, and airportNameEn
  @Index('city_airport_text_idx', { synchronize: false })
  @Column({
    type: 'tsvector',
    nullable: true,
    select: false,
    generatedType: 'STORED',
    asExpression: `
        to_tsvector('simple', 
          country_name || ' ' || 
          country_name_en || ' ' || 
          city_name || ' ' || 
          city_name_en || ' ' || 
          airport_code || ' ' || 
          airport_name || ' ' || 
          airport_name_en
        )`,
  })
  private readonly searchText: string;
}
