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

export type HotelSearchReservationSnakeCaseResponse = {
  data: {
    hotels: HotelSnakeCase[];
  };
  debug: Record<string, unknown>;
  status: 'ok';
  error: null;
};

export type HotelSearchReservationResponse = {
  hotels: Hotel[];
};
