import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import type { ValidationOptions } from 'class-validator';

const trimString = (value: unknown): unknown => (typeof value === 'string' ? value.trim() : value);

export function IsNotEmptyString(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }: { value: unknown }) =>
      Array.isArray(value) ? value.map(trimString) : trimString(value),
    ),
    IsString(validationOptions),
    IsNotEmpty(validationOptions),
  );
}
