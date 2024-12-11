import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BankCardType } from '../enums';
import { isBankCardNumber } from '../validators';

@ValidatorConstraint({ async: false })
class IsBankCardNumberConstraint implements ValidatorConstraintInterface {
  validate(card: string, args: ValidationArguments): boolean {
    const options = args.constraints[0] as { provider?: BankCardType };
    return isBankCardNumber(card, options);
  }

  defaultMessage(args: ValidationArguments): string {
    const options = args.constraints[0] as { provider?: BankCardType };
    if (options?.provider) {
      return `Card number is invalid for the provider ${options.provider}.`;
    }
    return 'Card number is invalid.';
  }
}

export function IsBankCardNumber(
  options: { provider?: BankCardType } = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsBankCardNumberConstraint,
    });
  };
}
