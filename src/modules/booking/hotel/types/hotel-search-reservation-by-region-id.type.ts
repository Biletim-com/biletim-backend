export type Hotel = {
  id: string;
  hid: number;
  rates?: Array<Record<string, unknown>>;
};

export type HotelSearchReservationByRegionIdSnakeCaseResponse = {
  data: {
    hotels: Hotel[];
    total_hotels: number;
  };
  debug: Record<string, unknown>;
  status: 'ok';
  error: null;
};

export type HotelSearchReservationByRegionIdResponse = {
  hotels: Hotel[];
  totalHotels: number;
};
