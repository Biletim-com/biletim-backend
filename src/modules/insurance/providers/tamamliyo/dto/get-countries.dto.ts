import { Countries } from '../types/get-countries-type';

export class CountryDto {
  countryCode: number;
  countryName: string;

  constructor(data: Countries) {
    this.countryCode = data.ulkeKodu;
    this.countryName = data.ulkeAd;
  }
}

export class GetCountriesResponseDto {
  data: CountryDto[];

  constructor(data: Countries[]) {
    this.data = data.map((country) => new CountryDto(country));
  }
}
