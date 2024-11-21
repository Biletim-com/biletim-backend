export type CreateInsuranceCancellationRequestResponse = {
  data: {
    id: number;
    partner_id: number;
    teklif_id: number;
    tc_kimlik_no: string;
    durum: string;
    musteri_adi: string;
    musteri_email: string;
    partner_email: string;
    musteri_telefon: number;
    urun_adi?: string | undefined;
    created_at: string;
    updated_at: string;
  };
};
