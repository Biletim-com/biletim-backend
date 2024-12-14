import { DeepConvertKeysToCamel } from '@app/common/types';

import { HotelDocument } from '@app/providers/hotel/ratehawk/models/hotel.schema';
import { Rate } from '@app/providers/hotel/ratehawk/types/hotel-rate.type';

export class HotelPageResponseDto {
  id: string;
  hid: number;
  rates: Array<DeepConvertKeysToCamel<Rate>>;
  barPriceData: any | null;
  staticData?: Partial<HotelDocument>;
}
