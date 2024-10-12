import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsReturnDateGreaterDate =
  (property: string, validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isReturnDateGreaterDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate: (value: any, args: ValidationArguments): boolean => {
          const relatedValue = (args.object as Record<string, any>)[
            args.constraints[0]
          ];
          if (!value || !relatedValue) {
            return true; // If there's no value or relatedValue, skip validation
          }
          return new Date(value) > new Date(relatedValue);
        },
        defaultMessage: (args: ValidationArguments): string => {
          return `${args.property} must be greater than ${args.constraints[0]}`;
        },
      },
    });
  };
