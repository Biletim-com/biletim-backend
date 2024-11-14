import { City, GetCitiesResponse } from '../types/get-cities.type';

export class CityDto {
  cityId: number;
  cityName: string;

  constructor(data: City) {
    this.cityId = data.ilId;
    this.cityName = data.ilAdi;
  }
}

export class GetCitiesResponseDto {
  success: boolean;
  data: CityDto[];

  constructor(response: GetCitiesResponse) {
    this.success = response.success;
    this.data = response.data.map((city) => new CityDto(city));
  }
}
