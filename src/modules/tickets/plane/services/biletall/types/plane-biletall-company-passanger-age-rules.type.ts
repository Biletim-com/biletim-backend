import { SoapEnvelope } from '@app/modules/tickets/bus/services/biletall/types/biletall-soap-envelope.type';

export type CompanyPassengerAgeRule = {
  TasiyiciFirmaNo: string[];
  TasiyiciFirma: string[];
  YolcuTip: string[];
  YolcuTipAciklama: string[];
  MinYas: string[];
  MaxYas: string[];
};

export type CompanyPassengerAgeRulesDataSet = {
  TasiyiciFirmaYolcuYasKurallar: Array<{
    TasiyiciFirmaYolcuYasKural: Array<{
      [K in keyof CompanyPassengerAgeRule]: [string];
    }>;
  }>;
};

export type CompanyPassengerAgeRulesResponse =
  SoapEnvelope<CompanyPassengerAgeRulesDataSet>;
