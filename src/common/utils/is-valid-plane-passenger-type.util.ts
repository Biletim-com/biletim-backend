import { airlineCompaniesAgeRules } from '../constants';
import { PassengerType } from '../enums';
import { ServiceError } from '../errors';
import { DateISODate } from '../types';

export const isValidPlanePassengerType = (
  birthday: DateISODate,
  passengerType: PassengerType,
  companyNumber: string,
): boolean => {
  const yearsOld = getAge(birthday);

  const ageRestrictions =
    airlineCompaniesAgeRules[companyNumber] || defaultAgeRestrictions;

  if (!ageRestrictions[passengerType]) {
    throw new ServiceError(
      `Company with the number ${ageRestrictions.companyName} does not sell tickets to ${passengerType}`,
    );
  }

  const passengerTypeRestrictions = ageRestrictions[passengerType];
  return (
    yearsOld > passengerTypeRestrictions.minAge &&
    yearsOld <= passengerTypeRestrictions.maxAge
  );
};

const getAge = (birthday: string): number => {
  const millisecondsDifference =
    new Date().getTime() - new Date(birthday).getTime();
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;

  return millisecondsDifference / millisecondsInYear;
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
  [PassengerType.SOLDIER]: { minAge: 18, maxAge: 32 },
};
