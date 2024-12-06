import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Day } from '../types/get-official-holidays.type';

export class OfficialHolidaysRequestDto {
  @ApiProperty({
    description: 'Year for which to get public holidays',
    example: '2024',
  })
  @IsNotEmpty()
  @IsString()
  year: string;
}

export class OfficialHolidaysDto {
  day: string;
  description: string;
  descriptionEN: string;
  descriptionDE: string;
  descriptionRU: string;
  isOfficialHoliday: string;
  groupName: string;

  constructor(data: Day) {
    this.day = data.Gun;
    this.description = data.Aciklama;
    this.descriptionEN = data.AciklamaEN;
    this.descriptionDE = data.AciklamaDE;
    this.descriptionRU = data.AciklamaRU;
    this.isOfficialHoliday = data.ResmiMi;
    this.groupName = data.GrupAd;
  }
}
