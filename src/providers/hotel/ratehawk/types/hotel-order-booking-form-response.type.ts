import { OrderUpsellData } from '../dto/hotel-booking-finish.dto';

type PaymentType = {
  amount: string;
  currency_code: string;
  is_need_credit_card_data: boolean;
  is_need_cvc: boolean;
  recommended_price?: {
    amount: string;
    currency_code: string;
    show_amount: string;
    show_currency_code: string;
  };
  type: 'deposit' | 'now' | 'hotel';
};

export type HotelOrderBookingFormResponseData = {
  is_gender_specification_required: boolean;
  item_id: number;
  order_id: number;
  partner_order_id: string;
  payment_types: PaymentType[];
  upsell_data: OrderUpsellData[];
};
