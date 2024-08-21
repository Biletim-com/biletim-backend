import { PlanePassengerAgeRule } from '../services/biletall/types/plane-biletall-company-passanger-age-rules.type';

export class PlanePassengerAgeRuleDto {
  carrierCompanyNo: string[];
  carrierCompany: string[];
  passengerType: string[];
  passengerTypeDescription: string[];
  minAge: string[];
  maxAge: string[];

  constructor(ageRule: PlanePassengerAgeRule) {
    (this.carrierCompanyNo = ageRule.TasiyiciFirmaNo),
      (this.carrierCompany = ageRule.TasiyiciFirma),
      (this.passengerType = ageRule.YolcuTip),
      (this.passengerTypeDescription = ageRule.YolcuTipAciklama),
      (this.minAge = ageRule.MinYas),
      (this.maxAge = ageRule.MaxYas);
  }
}
