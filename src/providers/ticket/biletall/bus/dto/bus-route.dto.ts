import { BusRouteDetail } from '../types/biletall-bus-route.type';

export class BusRouteDetailDto {
  arrivalPlace: string;
  orderNumber: string;
  departureDateTime: string;
  arrivalDateTime: string;
  routePointID: string;
  routePointName: string;

  constructor(routeDetail: BusRouteDetail) {
    this.arrivalPlace = routeDetail.VarisYeri;
    this.orderNumber = routeDetail.SiraNo;
    this.departureDateTime = routeDetail.KalkisTarihSaat;
    this.arrivalDateTime = routeDetail.VarisTarihSaat;
    this.routePointID = routeDetail.KaraNoktaID;
    this.routePointName = routeDetail.KaraNoktaAd;
  }
}
