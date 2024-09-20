import { SoapEnvelope } from '@app/modules/tickets/bus/services/biletall/types/biletall-soap-envelope.type';

export type PlanePassengerAgeRule = {
  TasiyiciFirmaNo: string[];
  TasiyiciFirma: string[];
  YolcuTip: string[];
  YolcuTipAciklama: string[];
  MinYas: string[];
  MaxYas: string[];
};

export type PlanePassengerAgeRulesDataSet = {
  TasiyiciFirmaYolcuYasKurallar: Array<{
    TasiyiciFirmaYolcuYasKural: Array<{
      [K in keyof PlanePassengerAgeRule]: [string];
    }>;
  }>;
};

export type PlanePassengerAgeRulesResponse =
  SoapEnvelope<PlanePassengerAgeRulesDataSet>;
