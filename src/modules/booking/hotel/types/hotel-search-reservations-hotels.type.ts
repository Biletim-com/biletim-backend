export type HotelSnakeCase = {
  id: string;
  hid: number;
  rates?: Array<Record<string, unknown>>;
  bar_price_data: any;
};
export type Hotel = {
  id: string;
  hid: number;
  rates?: Array<Record<string, unknown>>;
  barPriceData: any;
};

export type HotelsSearchReservationsSnakeCaseResponse = {
  data: {
    hotels: HotelSnakeCase[];
    total_hotels: number;
  };
  debug: Record<string, unknown>;
  status: 'ok';
  error: null;
};

export type HotelsSearchReservationsResponse = {
  hotels: Hotel[];
  totalHotels: number;
};
