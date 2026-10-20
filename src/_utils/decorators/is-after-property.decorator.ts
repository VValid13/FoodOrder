import { registerDecorator } from 'class-validator';
import type { ValidationArguments, ValidationOptions } from 'class-validator';

export function IsAfterProperty(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'isAfterProperty',
      target: target.constructor,
      propertyName: propertyName.toString(),
      constraints: [property],
      options: {
        message: `${propertyName.toString()} must be after ${property}`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [relatedProperty] = args.constraints as [string];
          const relatedValue = (args.object as Record<string, unknown>)[relatedProperty];
          return (
            typeof value === 'string' && typeof relatedValue === 'string' && value > relatedValue
          );
        },
      },
    });
  };
}
