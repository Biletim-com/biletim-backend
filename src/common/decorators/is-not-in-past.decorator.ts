import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsNotInPast = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotInPast',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true;
          const currentDate = new Date();
          const inputDate = new Date(value);
          return inputDate >= currentDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be in the past.`;
        },
      },
    });
  };
};
