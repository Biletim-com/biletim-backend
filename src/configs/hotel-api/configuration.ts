import { registerAs } from '@nestjs/config';

import { THotelApiConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.HOTEL_API,
  (): THotelApiConfiguration => ({
    hotelApiBaseUrl: process.env.HOTEL_API_BASE_URL,
    hotelApiUsername: process.env.HOTEL_WS_USERNAME,
    hotelApiPassword: process.env.HOTEL_WS_PASSWORD,
  }),
);
