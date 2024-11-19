import { PassengerType } from '../enums';
import { DateISODate } from '../types';

export const isValidPlanePassengerType = (
  birthday: DateISODate,
  passengerType: PassengerType,
): boolean => {
  const yearsOld = getAge(birthday);

  const isValidPassengerTypeBasedOnAge = {
    [PassengerType.BABY]: yearsOld >= 0 && yearsOld <= 2,
    [PassengerType.CHILD]: yearsOld > 2 && yearsOld <= 12,
    [PassengerType.STUDENT]: yearsOld > 12 && yearsOld <= 24,
    [PassengerType.ADULT]: yearsOld >= 18 && yearsOld < 65,
    [PassengerType.ELDERLY]: yearsOld >= 65,
  }[passengerType];

  return isValidPassengerTypeBasedOnAge;
};

const getAge = (birthday: string): number => {
  const millisecondsDifference =
    new Date().getTime() - new Date(birthday).getTime();
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;

  return millisecondsDifference / millisecondsInYear;
};
