type Hotel = {
  id: string;
  hid: number;
  name: string;
  region_id: number;
};

type HotelRegion = {
  id: number;
  name: string;
  type: string;
  country_code: string;
};

export type HotelSearchResponseData = {
  hotels: Hotel[];
  regions: HotelRegion[];
};
