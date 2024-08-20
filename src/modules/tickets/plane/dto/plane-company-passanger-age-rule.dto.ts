import { CompanyPassengerAgeRule } from '../services/biletall/types/plane-biletall-company-passanger-age-rules.type';

export class CompanyPassengerAgeRuleDto {
  carrierCompanyNo: string[];
  carrierCompany: string[];
  passengerType: string[];
  passengerTypeDescription: string[];
  minAge: string[];
  maxAge: string[];

  constructor(ageRule: CompanyPassengerAgeRule) {
    (this.carrierCompanyNo = ageRule.TasiyiciFirmaNo),
      (this.carrierCompany = ageRule.TasiyiciFirma),
      (this.passengerType = ageRule.YolcuTip),
      (this.passengerTypeDescription = ageRule.YolcuTipAciklama),
      (this.minAge = ageRule.MinYas),
      (this.maxAge = ageRule.MaxYas);
  }
}
