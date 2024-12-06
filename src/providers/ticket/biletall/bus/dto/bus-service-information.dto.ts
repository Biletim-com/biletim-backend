import { DateISOTime, DateTime } from '@app/common/types';
import { BusServiceInformation } from '../types/biletall-bus-service-information.type';
import { BoardingPointRequestDto } from './bus-boarding-point.dto';

export class ServiceInformationRequestDto extends BoardingPointRequestDto {
  date?: DateTime;
  time?: DateISOTime;
}

export class ServiceInformationDto {
  place: string;
  time: string;
  visibleOnInternet: boolean;

  constructor(serviceInformation: BusServiceInformation) {
    this.place = serviceInformation.Yer;
    this.time = serviceInformation.Saat;
    this.visibleOnInternet = serviceInformation.Internette_Gozuksunmu === '1';
  }
}
