import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAfter(
  relatedProperty: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [relatedProperty],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          // Ensure both values are valid ISO date strings and compare them
          const currentDate = new Date(value);
          const relatedDate = new Date(relatedValue);

          return (
            currentDate instanceof Date &&
            !isNaN(currentDate.getTime()) &&
            relatedDate instanceof Date &&
            !isNaN(relatedDate.getTime()) &&
            currentDate > relatedDate
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be later than ${relatedPropertyName}`;
        },
      },
    });
  };
}
