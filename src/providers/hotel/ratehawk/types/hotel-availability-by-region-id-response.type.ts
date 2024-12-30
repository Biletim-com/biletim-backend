import { Hotel } from './hotel.type';

export type HotelAvailabilityByRegionIdResponseData = {
  hotels: Hotel[];
  total_hotels: number;
};
