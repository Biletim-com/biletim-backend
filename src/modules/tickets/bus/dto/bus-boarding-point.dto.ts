import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BoardingPoint } from '../services/biletall/types/biletall-boarding-point.type';
import { ApiProperty } from '@nestjs/swagger';

export class BoardingPointRequestDto {
  @ApiProperty({
    description: 'Company number (optional)',
    example: '37',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyNo?: string;

  @ApiProperty({
    description: 'ID of the departure point',
    example: '84',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  departurePointID: string;

  @ApiProperty({
    description: 'Local time in the format yyyy-MM-ddTHH:mm:ss',
    example: '2024-10-13T12:00:00',
    required: true,
  })
  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsNotEmpty()
  localTime: string;

  @ApiProperty({
    description: 'Route number',
    example: '1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  routeNumber: string;
}

export class BoardingPointDto {
  place?: string;
  time: string;
  visibleOnInternet?: boolean;

  constructor(boardingPoint: BoardingPoint) {
    this.place = boardingPoint.Yer;
    this.time = boardingPoint.Saat;
    this.visibleOnInternet =
      typeof boardingPoint.Internette_Gozuksunmu === 'string'
        ? boardingPoint.Internette_Gozuksunmu === '1'
        : undefined;
  }
}
