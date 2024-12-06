import { PlanePassengerAgeRule } from '../types/biletall-plane-company-passanger-age-rules.type';

export class PlanePassengerAgeRuleDto {
  carrierCompanyNumber: string[];
  carrierCompany: string[];
  passengerType: string[];
  passengerTypeDescription: string[];
  minAge: string[];
  maxAge: string[];

  constructor(ageRule: PlanePassengerAgeRule) {
    this.carrierCompanyNumber = ageRule.TasiyiciFirmaNo;
    this.carrierCompany = ageRule.TasiyiciFirma;
    this.passengerType = ageRule.YolcuTip;
    this.passengerTypeDescription = ageRule.YolcuTipAciklama;
    this.minAge = ageRule.MinYas;
    this.maxAge = ageRule.MaxYas;
  }
}
