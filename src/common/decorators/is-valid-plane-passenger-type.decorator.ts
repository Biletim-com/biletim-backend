import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

import { isValidPlanePassengerType } from '../utils';
import { PassengerType } from '../enums';

@ValidatorConstraint({ async: false })
class IsValidPlanePassengerTypeConstraint
  implements ValidatorConstraintInterface
{
  validate(passengerType: PassengerType, args: ValidationArguments) {
    const birthday = (args.object as any).birthday;

    if (!birthday) {
      throw new Error('[birthday] field does not exist in the DTO');
    }

    return isValidPlanePassengerType(birthday, passengerType);
  }

  defaultMessage(): string {
    return 'Invalid passenger type based on birthday.';
  }
}

export const IsValidPlanePassengerType = (
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPlanePassengerTypeConstraint,
    });
  };
};
