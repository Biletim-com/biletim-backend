export type PaymentType = {
  amount: string;
  currencyCode: string;
  isNeedCreditCardData: boolean;
  isNeedCvc: boolean;
  recommendedPrice: string | null;
  type: string;
};
export type PaymentTypeSnakeCase = {
  amount: string;
  currency_code: string;
  is_need_credit_card_data: boolean;
  is_need_cvc: boolean;
  recommended_price: string | null;
  type: string;
};
export type HotelOrderBookingFormSnakeCaseResponse = {
  data: {
    is_gender_specification_required: boolean;
    item_id: number;
    order_id: number;
    partner_order_id: string;
    payment_types: PaymentTypeSnakeCase[];
    upsell_data: Record<string, unknown>[];
  };
  debug: Record<string, unknown>;
  status: 'ok';
  error: null;
};

export type HotelOrderBookingFormResponse = {
  isGenderSpecificationRequired: boolean;
  itemId: number;
  orderId: number;
  partnerOrderId: string;
  paymentTypes: PaymentType[];
  upsellData: Record<string, unknown>[];
};
