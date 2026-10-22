import { registerDecorator } from 'class-validator';
import type { ValidationArguments, ValidationOptions } from 'class-validator';

export function IsAtMostLengthOf(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'isAtMostLengthOf',
      target: target.constructor,
      propertyName: propertyName.toString(),
      constraints: [property],
      options: {
        message: `$property must not be greater than the number of ${property}`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const relatedProperty: string = args.constraints[0];
          const relatedValue: unknown = Reflect.get(args.object, relatedProperty);
          return (
            typeof value === 'number' && Array.isArray(relatedValue) && value <= relatedValue.length
          );
        },
      },
    });
  };
}
