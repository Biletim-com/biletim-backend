import { Hotel } from './hotel.type';

export type HotelRateValidationResponseData = {
  hotels: Hotel[];
  changes: {
    price_changed: boolean;
  };
};
