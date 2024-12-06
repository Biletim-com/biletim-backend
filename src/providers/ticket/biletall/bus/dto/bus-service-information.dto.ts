import { BusServiceInformation } from '../types/biletall-bus-service-information.type';

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
