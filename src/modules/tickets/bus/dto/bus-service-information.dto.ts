import { IsDateString, IsOptional } from 'class-validator';
import { BoardingPointRequestDto } from './bus-boarding-point.dto';
import { ServiceInformation } from '../services/biletall/types/biletall-service-information.type';
import { DateTime } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceInformationRequestDto extends BoardingPointRequestDto {
  @ApiProperty({
    description: 'Date in the format yyyy-MM-ddTHH:mm:ss',
    example: '2024-09-13T12:00:00',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: DateTime;

  @ApiProperty({
    description: 'Time in the format yyyy-MM-ddTHH:mm:ss',
    example: '2024-09-13T15:30:00',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  time?: DateTime;
}

export class ServiceInformationDto {
  place: string;
  time: string;
  visibleOnInternet: boolean;

  constructor(serviceInformation: ServiceInformation) {
    this.place = serviceInformation.Yer;
    this.time = serviceInformation.Saat;
    this.visibleOnInternet = serviceInformation.Internette_Gozuksunmu === '1';
  }
}
