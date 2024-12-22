import { Currency } from '@app/common/enums';

export type HotelOrderCancelResponseData = {
  // Amount of the cancellation fee.
  amount_payable: {
    amount: string;
    currency_code: Currency;
  };
  // Refunded amount.
  amount_refunded: {
    amount: string;
    currency_code: Currency;
  };
  // Amount of the order.
  amount_sell: {
    amount: string;
    currency_code: Currency;
  };
};
