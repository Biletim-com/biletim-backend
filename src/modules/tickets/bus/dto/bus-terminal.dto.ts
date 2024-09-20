import { BusTerminal } from '../services/biletall/types/biletall-bus-stop-points.type';

export class BusTerminalDto {
  id: string;
  cityId: string;
  countryCode: string;
  region: string | null;
  name: string;
  description: string | null;
  isCenter: boolean;
  affiliatedCenterId: string;
  appearInSearch: boolean;

  constructor(busStopPoint: BusTerminal) {
    this.id = busStopPoint.ID;
    this.cityId = busStopPoint.SeyahatSehirID;
    this.countryCode = busStopPoint.UlkeKodu;
    this.region = busStopPoint.Bolge ? busStopPoint.Bolge : null;
    this.name = busStopPoint.Ad;
    this.description = busStopPoint.Aciklama ? busStopPoint.Aciklama : null;
    this.isCenter = busStopPoint.MerkezMi === '1' ? true : false;
    this.affiliatedCenterId = busStopPoint.BagliOlduguNoktaID;
    this.appearInSearch = busStopPoint.AramadaGorunsun === 'True';
  }
}
