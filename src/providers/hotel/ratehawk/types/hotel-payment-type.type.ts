export type PaymentType = {
  amount: string;
  show_amount: string;
  currency_code: string;
  show_currency_code: string;
  by: any | null;
  is_need_credit_card_data: boolean;
  is_need_cvc: boolean;
  type: string;
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
  currency_code: string;
  value: string;
};

type TaxData = {
  taxes: Tax[];
};

type Tax = {
  name: string;
  included_by_supplier: boolean;
  amount: string;
  currency_code: string;
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

type CancellationPenalties = {
  policies: CancellationPolicy[];
  free_cancellation_before: string | null;
};

type CancellationPolicy = {
  start_at: string | null;
  end_at: string | null;
  amount_charge: string;
  amount_show: string;
  commission_info: CommissionInfo;
};
