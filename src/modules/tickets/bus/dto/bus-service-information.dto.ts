import { IsDateString, IsOptional } from 'class-validator';
import { BoardingPointDto } from './bus-boarding-point.dto';

export class ServiceInformationDto extends BoardingPointDto {
  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsOptional()
  date?: Date;

  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsOptional()
  time?: string;
}
