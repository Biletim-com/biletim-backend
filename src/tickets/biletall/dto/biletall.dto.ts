  export class CompanyRequestDto {
    FirmaNo = 0;
  }
  
  export class ScheduleListRequestDto {
    FirmaNo = 0;
    KalkisNoktaID: number;
    VarisNoktaID: number;
    Tarih: string;
    AraNoktaGelsin?: boolean;
    IslemTipi: number;
    YolcuSayisi = 1;
    Ip: string;
  } 