// entity
import { HotelRoomGuest } from '@app/modules/orders/hotel-booking/entities/hotel-room-guest.entity';

// dto
import { OrderBookingFinishStatusRequestDto } from './hotel-order-booking-finish-status.dto';

// types
import { DateTime, UUID } from '@app/common/types';
import { Currency } from '@app/common/enums';
import { HotelOrderUpsellName } from '../types/hotel-order-upsell-name.type';

export type PaymentType = {
  type: 'now' | 'deposit' | 'hotel';
  amount: string;
  currencyCode: Currency;
};

export type OrderUpsellData = {
  attributes: {
    checkinDatetime: DateTime;
    checkoutDatetime: DateTime;
  };
  name: HotelOrderUpsellName;
  ruleId: number;
  uid: UUID;
};

type UserDto = {
  email: string;
  phone: string;
  comment?: string;
};

type RoomDto = {
  guests: HotelRoomGuest[];
};

class SupplierDataDto {
  firstNameOriginal: string;
  lastNameOriginal: string;
  email: string;
  phone: string;
}

export class BookingFinishRequestDto {
  arrivalDatetime?: DateTime;
  user: UserDto;
  supplierData: SupplierDataDto;
  partner: OrderBookingFinishStatusRequestDto;
  language: string;
  rooms: RoomDto[];
  upsellData: OrderUpsellData[];
  paymentType: PaymentType;
}
