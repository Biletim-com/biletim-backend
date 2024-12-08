import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type PlaneTicketReturnPenaltyPassenger = {
  EBiletNo: string;
  Ad: string;
  Soyad: string;
  Tutar: string;
  Komisyon: string;
  FirmaCeza: string;
  KomisyonCezaliMi: string;
  ToplamCeza: string;
  OlusanAcikPara: string;
};

type PlaneTicketReturnPenaltyDataSet = {
  SatisIptalCeza: Array<{
    Pnr: Array<
      {
        PnrNo: [string];
      } & {
        Yolcular: Array<{
          Yolcu: Array<{
            [K in keyof PlaneTicketReturnPenaltyPassenger]: [string];
          }>;
        }>;
      }
    >;
  }>;
};

export type PlaneTicketReturnPenaltyResponse =
  SoapEnvelope<PlaneTicketReturnPenaltyDataSet>;
