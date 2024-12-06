import { BusBoardingPoint } from '../types/biletall-bus-boarding-point.type';

export class BoardingPointRequestDto {
  companyNumber?: string;
  departurePointID: string;
  localTime: string;
  routeNumber: string;
}

export class BoardingPointDto {
  place?: string;
  time: string;
  visibleOnInternet?: boolean;

  constructor(boardingPoint: BusBoardingPoint) {
    this.place = boardingPoint.Yer;
    this.time = boardingPoint.Saat;
    this.visibleOnInternet =
      typeof boardingPoint.Internette_Gozuksunmu === 'string'
        ? boardingPoint.Internette_Gozuksunmu === '1'
        : undefined;
  }
}
