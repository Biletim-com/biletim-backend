import { airlineCompaniesAgeRules } from '../constants';
import { PassengerType } from '../enums';
import { ServiceError } from '../errors';
import { DateISODate } from '../types';
import { calculateAge } from '../utils';

export const isValidPlanePassengerType = (
  birthday: DateISODate,
  passengerType: PassengerType,
  companyNumber: string,
): boolean => {
  const yearsOld = calculateAge(birthday);

  const ageRestrictions =
    airlineCompaniesAgeRules[companyNumber] || defaultAgeRestrictions;

  if (!ageRestrictions[passengerType]) {
    throw new ServiceError(
      `${ageRestrictions.companyName} does not sell tickets to ${passengerType}`,
    );
  }

  const passengerTypeRestrictions = ageRestrictions[passengerType];
  return (
    yearsOld > passengerTypeRestrictions.minAge &&
    yearsOld <= passengerTypeRestrictions.maxAge
  );
};

const defaultAgeRestrictions: Record<
  PassengerType,
  { minAge: number; maxAge: number }
> = {
  [PassengerType.BABY]: { minAge: 0, maxAge: 2 },
  [PassengerType.CHILD]: { minAge: 2, maxAge: 12 },
  [PassengerType.STUDENT]: { minAge: 12, maxAge: 24 },
  [PassengerType.ADULT]: { minAge: 12, maxAge: 65 },
  [PassengerType.ELDERLY]: { minAge: 65, maxAge: 120 },
  [PassengerType.MILITARY]: { minAge: 18, maxAge: 32 },
};
