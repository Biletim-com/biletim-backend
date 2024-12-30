import { Rate } from './hotel-rate.type';

export type Hotel = {
  id: string;
  hid: number;
  rates: Rate[];
  bar_price_data: any | null;
};
