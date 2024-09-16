import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BoardingPoint } from '../services/biletall/types/biletall-boarding-point.type';

export class BoardingPointRequestDto {
  @IsString()
  @IsOptional()
  companyNo?: string;

  @IsString()
  @IsNotEmpty()
  departurePointID: string;

  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsNotEmpty()
  localTime: string;

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
