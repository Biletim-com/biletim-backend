import { Currency } from '@app/common/enums';
import { DateTime } from '@app/common/types';

export type PaymentType = {
  amount: string;
  show_amount: string;
  currency_code: Currency;
  show_currency_code: Currency;
  by: any | null;
  is_need_credit_card_data: boolean;
  is_need_cvc: boolean;
  type: 'deposit' | 'now' | 'hotel';
  vat_data: VatData;
  tax_data: TaxData;
  perks: Record<string, any>;
  commission_info: CommissionInfo;
  cancellation_penalties: CancellationPenalties;
  recommended_price: any | null;
};

type VatData = {
  included: boolean;
  applied: boolean;
  amount: string;
  currency_code: Currency;
  value: string;
};

type TaxData = {
  taxes: Tax[];
};

type Tax = {
  name: string;
  included_by_supplier: boolean;
  amount: string;
  currency_code: Currency;
};

type CommissionInfo = {
  show: CommissionDetails;
  charge: CommissionDetails;
};

type CommissionDetails = {
  amount_gross: string;
  amount_net: string;
  amount_commission: string;
};

export type CancellationPenalties = {
  policies: CancellationPolicy[];
  free_cancellation_before: DateTime;
};

type CancellationPolicy = {
  start_at: DateTime | null;
  end_at: DateTime | null;
  amount_charge: string;
  amount_show: string;
  commission_info: CommissionInfo;
};
