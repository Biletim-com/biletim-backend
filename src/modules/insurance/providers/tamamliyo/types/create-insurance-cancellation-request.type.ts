export type CreateInsuranceCancellationSuccessfulRequestResponse = {
  success: string;
  message: string;
  data: {
    partner_id: number;
    teklif_id: number;
    tc_kimlik_no: number;
    musteri_adi: string;
    musteri_email: string;
    partner_email: string;
    musteri_telefon: number;
    urun_adi?: string | undefined;
    durum: string;
    created_at: string;
    updated_at: string;
    id: number;
  };
};

export type CreateInsuranceCancellationFailureRequestResponse = {
  success: string;
  data: {
    error: string;
  };
};
