import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'OnlyOneDefined', async: false })
class OnlyOneDefinedConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const fields = args.constraints;
    const definedFieldsCount = fields.filter(
      (field) =>
        args.object[field] !== undefined && args.object[field] !== null,
    ).length;

    // Only one of the fields should be defined
    return definedFieldsCount === 1;
  }

  defaultMessage(args: ValidationArguments) {
    const fields = args.constraints.join(', ');
    return `Exactly one of the following fields must be defined: ${fields}.`;
  }
}

export const OnlyOneDefined = (
  fields: string[],
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: fields,
      validator: OnlyOneDefinedConstraint,
    });
  };
};
