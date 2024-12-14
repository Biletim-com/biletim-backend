import { Hotel } from './hotel.type';

export type HotelsAvailabilityByHoltelIdsResponseData = {
  hotels: Hotel[];
  total_hotels: number;
};
