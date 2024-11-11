import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

import { validateTCNumber } from '../utils';

@ValidatorConstraint({ async: false })
class IsTCNumberConstraint implements ValidatorConstraintInterface {
  validate(tcNumber: string): boolean {
    return validateTCNumber(tcNumber);
  }

  defaultMessage(): string {
    return 'Invalid TC number format.';
  }
}

export const IsTCNumber = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTCNumberConstraint,
    });
  };
};
