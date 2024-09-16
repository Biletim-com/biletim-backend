import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  isEmpty,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsInEnumKeysConstraint implements ValidatorConstraintInterface {
  private enumType: any;

  validate(value: any, args: ValidationArguments): boolean {
    this.enumType = args.constraints[0];
    const isOptional = args.constraints[1]?.isOptional ?? false;

    if (isOptional && (value === undefined || value === null || value === '')) {
      return true;
    }

    if (isEmpty(value)) {
      return false;
    }

    const enumKeys = Object.keys(this.enumType).filter((key) =>
      isNaN(Number(key)),
    );
    const matchedKey = enumKeys.find(
      (key) => key.toLowerCase() === value.toLowerCase(),
    );

    if (matchedKey) {
      (args.object as any)[args.property] = this.enumType[matchedKey];
      return true;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    if (isEmpty(args.value)) {
      return `${args.property} is required and cannot be empty.`;
    }

    return `${
      args.property
    } must be a valid enum key. Valid keys are: ${Object.keys(
      args.constraints[0],
    ).join(', ')}`;
  }
}

export const IsInEnumKeys = (
  enumType: any,
  validationOptions?: ValidationOptions,
  isOptional = false,
) => {
  return (target: object, propertyName: string): void => {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumType, { isOptional }],
      validator: IsInEnumKeysConstraint,
    });
  };
};
