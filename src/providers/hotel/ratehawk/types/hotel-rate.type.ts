import { PaymentType } from './hotel-payment-type.type';

export type Rate = {
  match_hash: string;
  search_hash: string | null;
  daily_prices: string[];
  meal: string;
  meal_data: MealData;
  payment_options: PaymentOptions;
  bar_rate_price_data: any | null;
  rg_ext: RgExt;
  room_name: string;
  room_name_info: any | null;
  serp_filters: string[];
  sell_price_limits: any | null;
  allotment: number;
  amenities_data: string[];
  any_residency: boolean;
  deposit: any | null;
  no_show: NoShow | null;
  room_data_trans: RoomDataTrans;
};

type MealData = {
  value: string;
  has_breakfast: boolean;
  no_child_meal: boolean;
};

type PaymentOptions = {
  payment_types: PaymentType[];
};

type RgExt = {
  class: number;
  quality: number;
  sex: number;
  bathroom: number;
  bedding: number;
  family: number;
  capacity: number;
  club: number;
  bedrooms: number;
  balcony: number;
  view: number;
  floor: number;
};

type NoShow = {
  amount: string;
  currency_code: string;
  from_time: string;
};

type RoomDataTrans = {
  main_room_type: string;
  main_name: string;
  bathroom: any | null;
  bedding_type: string | null;
  misc_room_type: string | null;
};
