import { PlaneAirport } from '../services/biletall/types/biletall-plane-airport.type';

export class PlaneAirportDto {
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

  constructor(airport: PlaneAirport) {
    this.countryCode = airport.UlkeKod;
    this.countryName = airport.UlkeAd;
    this.countryNameEn = airport.UlkeAdEn;
    this.cityCode = airport.SehirKod;
    this.cityName = airport.SehirAd;
    this.cityNameEn = airport.SehirAdEn;
    this.airportCode = airport.HavaAlanKod;
    this.airportName = airport.HavaAlanAd;
    this.airportNameEn = airport.HavaAlanAdEn;
    this.airportRegion = airport.HavaAlanBolge;
    this.airportRegionEn = airport.HavaAlanBolgeEn;
  }
}
