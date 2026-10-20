import { ValidateIf } from 'class-validator';

export function IsOptionalNotNull(): PropertyDecorator {
  return ValidateIf((_object: object, value: unknown) => value !== undefined);
}
