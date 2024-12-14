type Hotel = {
  id: string;
  hid: number;
  rates?: Array<Record<string, unknown>>;
  bar_price_data: any;
};

export type HotelPrebookResponseData = {
  hotels: Hotel[];
  changes: {
    price_changed: boolean;
  };
};
