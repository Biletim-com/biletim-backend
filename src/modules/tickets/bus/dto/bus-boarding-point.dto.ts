import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class BoardingPointDto {
  @IsInt()
  @IsOptional()
  companyNo?: number;

  @IsInt()
  @IsNotEmpty()
  departurePointID!: number;

  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsNotEmpty()
  localTime!: string;

  @IsInt()
  @IsNotEmpty()
  routeNumber!: number;
}
