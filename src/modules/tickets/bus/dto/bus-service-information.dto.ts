import { IsDateString, IsOptional } from 'class-validator';
import { BoardingPointRequestDto } from './bus-boarding-point.dto';
import { ServiceInformation } from '../services/biletall/types/biletall-service-information.type';
import { DateTime } from '@app/common/types';

export class ServiceInformationRequestDto extends BoardingPointRequestDto {
  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsOptional()
  date?: DateTime;

  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
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
