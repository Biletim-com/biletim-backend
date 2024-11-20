import { PassengerType } from '../enums/passanger.enums';

export interface AgeRule {
  minAge: number;
  maxAge: number;
}

export type AirlineRules = {
  [key in PassengerType]?: AgeRule;
} & { companyName: string };

export type AirlineCompanyAgeRules = {
  [airlineId: string]: AirlineRules;
};

export const airlineCompaniesAgeRules: AirlineCompanyAgeRules = {
  '1000': {
    companyName: 'Thy',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.STUDENT]: {
      minAge: 12,
      maxAge: 24,
    },
    [PassengerType.SOLDIER]: {
      minAge: 18,
      maxAge: 32,
    },
  },
  '1002': {
    companyName: 'SunExpress',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.STUDENT]: {
      minAge: 12,
      maxAge: 24,
    },
    [PassengerType.SOLDIER]: {
      minAge: 18,
      maxAge: 32,
    },
  },
  '1003': {
    companyName: 'AtlasJet',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.STUDENT]: {
      minAge: 12,
      maxAge: 28,
    },
    [PassengerType.SOLDIER]: {
      minAge: 18,
      maxAge: 32,
    },
  },
  '1005': {
    companyName: 'OnurAir',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.STUDENT]: {
      minAge: 12,
      maxAge: 24,
    },
    [PassengerType.SOLDIER]: {
      minAge: 18,
      maxAge: 32,
    },
  },
  '1006': {
    companyName: 'Pegasus',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.STUDENT]: {
      minAge: 12,
      maxAge: 24,
    },
    [PassengerType.SOLDIER]: {
      minAge: 18,
      maxAge: 32,
    },
  },
  '1007': {
    companyName: 'OnurAir',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.STUDENT]: {
      minAge: 12,
      maxAge: 24,
    },
    [PassengerType.SOLDIER]: {
      minAge: 18,
      maxAge: 32,
    },
  },
  '1012': {
    companyName: 'Airays',
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
  },
  '1013': {
    companyName: 'AJet',
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.STUDENT]: {
      minAge: 12,
      maxAge: 24,
    },
    [PassengerType.SOLDIER]: {
      minAge: 18,
      maxAge: 32,
    },
  },
  '1050': {
    companyName: 'ThyWebsAgent',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
  },
  '1052': {
    companyName: 'SunExpress',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '1053': {
    companyName: 'AtlasJet',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '1055': {
    companyName: 'OnurAir',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '1056': {
    companyName: 'Pegasus',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '1057': {
    companyName: 'OnurAir',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '1063': {
    companyName: 'AJet',
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.STUDENT]: {
      minAge: 12,
      maxAge: 24,
    },
    [PassengerType.SOLDIER]: {
      minAge: 18,
      maxAge: 32,
    },
  },
  '1100': {
    companyName: 'Galileo',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.STUDENT]: {
      minAge: 12,
      maxAge: 24,
    },
  },
  '3000': {
    companyName: 'Cafetur',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '3100': {
    companyName: 'Paximum',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
  },
  '4000': {
    companyName: 'Oger',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4200': {
    companyName: 'Nakhal',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4250': {
    companyName: 'Corendon',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4300': {
    companyName: 'AirArabia',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4310': {
    companyName: 'AirArabiaG9',
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
  },
  '4320': {
    companyName: 'AirArabia3L',
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
  },
  '4350': {
    companyName: 'CharterScanners',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4400': {
    companyName: 'Airays',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4450': {
    companyName: 'SkyUp',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4500': {
    companyName: 'AdelaTurCharter',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4550': {
    companyName: 'AirlineTools',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4650': {
    companyName: 'TravelFusion',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4750': {
    companyName: 'PartoCrsCharter',
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
  },
  '4800': {
    companyName: 'Ach',
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
  },
  '4850': {
    companyName: 'FlyDubai',
    [PassengerType.BABY]: {
      minAge: 0,
      maxAge: 2,
    },
    [PassengerType.CHILD]: {
      minAge: 2,
      maxAge: 12,
    },
    [PassengerType.ADULT]: {
      minAge: 12,
      maxAge: 120,
    },
  },
};
