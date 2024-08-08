import { PlaneAirPoint } from '../services/biletall/types/biletall-plane-air-points.type';

export class PlaneAirPointDto {
  countryCode: string;
  countryName: string;
  countryNameEn: string;
  cityCode: string;
  cityName: string;
  cityNameEn: string;
  airportCode: string;
  airportName: string;
  airportNameEn: string;
  airportRegion: string;
  airportRegionEn: string;

  constructor(airPoint: PlaneAirPoint) {
    this.countryCode = airPoint.UlkeKod;
    this.countryName = airPoint.UlkeAd;
    this.countryNameEn = airPoint.UlkeAdEn;
    this.cityCode = airPoint.SehirKod;
    this.cityName = airPoint.SehirAd;
    this.cityNameEn = airPoint.SehirAdEn;
    this.airportCode = airPoint.HavaAlanKod;
    this.airportName = airPoint.HavaAlanAd;
    this.airportNameEn = airPoint.HavaAlanAdEn;
    this.airportRegion = airPoint.HavaAlanBolge;
    this.airportRegionEn = airPoint.HavaAlanBolgeEn;
  }
}
