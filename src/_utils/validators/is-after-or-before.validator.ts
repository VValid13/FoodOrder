import { registerDecorator } from 'class-validator';
import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { TIME_COMPARISONS } from '../constants/time.constants.js';
import type { TimeComparison } from '../constants/time.constants.js';
import { parseTime } from '../helpers/parse-time.helper.js';

export function IsAfterOrBefore(
  property: string,
  comparison: TimeComparison,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'isAfterOrBefore',
      target: target.constructor,
      propertyName: propertyName.toString(),
      constraints: [property, comparison],
      options: {
        message: `$property must be ${comparison} ${property}`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [relatedProperty, wantedComparison] = args.constraints as [string, TimeComparison];
          const relatedValue = (args.object as Record<string, unknown>)[relatedProperty];
          if (typeof value !== 'string' || typeof relatedValue !== 'string') {
            return false;
          }

          const time = parseTime(value);
          const relatedTime = parseTime(relatedValue);
          if (!time || !relatedTime) {
            return false;
          }

          return wantedComparison === TIME_COMPARISONS.AFTER
            ? time.isAfter(relatedTime)
            : time.isBefore(relatedTime);
        },
      },
    });
  };
}
