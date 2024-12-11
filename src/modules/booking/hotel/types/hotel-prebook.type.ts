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

export type HotelPrebookSnakeCaseResponse = {
  data: {
    hotels: HotelSnakeCase[];
    changes: {
      price_changed: boolean;
    };
  };
  debug: Record<string, unknown>;
  status: 'ok';
  error: null;
};

export type HotelPrebookResponse = {
  hotels: Hotel[];
  changes: {
    priceChanged: boolean;
  };
};
