export type Hotel = {
  id: string;
  hid: number;
  name: string;
  regionId: number;
};

export type HotelRegion = {
  id: number;
  name: string;
  type: string;
  countryCode: string;
};

export type HotelAutocompleteSearchResponse = {
  hotels: Hotel[];
  regions: HotelRegion[];
};

export type HotelSnakeCase = {
  id: string;
  hid: number;
  name: string;
  region_id: number;
};

export type HotelRegionSnakeCase = {
  id: number;
  name: string;
  type: string;
  country_code: string;
};

export type HotelAutocompleteSearchSnakeCaseResponse = {
  data: {
    hotels: HotelSnakeCase[];
    regions: HotelRegionSnakeCase[];
  };
  debug: Record<string, unknown>;
  status: 'ok';
  error: null;
};
