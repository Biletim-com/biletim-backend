export type HotelStaticDataResponseData = {
  id: string;
  address: string;
  amenity_groups: {
    amenities: string[];
    group_name?: string;
    non_free_amenities?: string[];
  }[];
  check_in_time: string;
  check_out_time: string;
  description_struct: {
    paragraphs: string[];
    title?: string;
  };
  email: string;
  hotel_chain: string;
  images: string[];
  images_ext: {
    category_slug: string;
    url: string;
  }[];
  kind: string;
  latitude: number;
  longitude: number;
  name: string;
  metapolicy_struct: object;
  metapolicy_extra_info: string;
  phone: string;
  policy_struct: object[];
  postal_code: string;
  region: {
    country_code: string;
    iata?: string;
    id?: number;
    name?: string;
    type: string;
  };
  room_groups: {
    images: string[];
    images_ext: object[];
    name: string;
    room_amenities: string[];
    room_group_id?: number;
    rg_ext: object;
    name_struct?: object;
  };
  star_rating: number;
  serp_filters: string[];
  star_certificate: object;
  is_closed: boolean;
  facts: {
    floors_number?: number;
    rooms_number?: number;
    year_built?: number;
    year_renovated?: number;
    electricity?: object;
  };
  payment_methods: string[];
  front_desk_time_start: string;
  front_desk_time_end: string;
  is_gender_specification_required: boolean;
  keys_pickup: Record<string, any>;
  hid: string;
};
