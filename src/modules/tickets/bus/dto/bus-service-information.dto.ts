import { IsDateString, IsOptional } from 'class-validator';
import { BoardingPointDto } from './bus-boarding-point.dto';
import { ServiceInformation } from '../services/biletall/types/biletall-service-information.type';

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

export class ServiceInformationResponseDto {
  place: string;
  time: string;
  visibleOnInternet: string;

  constructor(serviceInformation: ServiceInformation) {
    this.place = serviceInformation.Yer;
    this.time = serviceInformation.Saat;
    this.visibleOnInternet = serviceInformation.Internette_Gozuksunmu;
  }

  static finalVersionServiceInformationResponse(
    serviceInformations: ServiceInformation[],
  ): ServiceInformationResponseDto[] {
    return serviceInformations.map(
      (serviceInformation) =>
        new ServiceInformationResponseDto(serviceInformation),
    );
  }
}
