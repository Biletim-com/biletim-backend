import { Country } from '../type/tickets-travel-country-code.type';

export class CountryDto {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  busTravelWarning: string;
  busTravelWarningEn: string;
  searchKeywords: string;

  constructor(data: Country) {
    this.id = data.ID;
    this.code = data.Kod;
    this.name = data.Ad;
    this.nameEn = data.AdEn;
    this.busTravelWarning = data.OtobusSeyahatUyari;
    this.busTravelWarningEn = data.OtobusSeyahatUyariEn;
    this.searchKeywords = data.AramaAnahtarlari;
  }
}
