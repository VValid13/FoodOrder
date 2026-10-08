import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import type { ValidationOptions } from 'class-validator';

export function IsNotEmptyString(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.trim() : value,
    ),
    IsString(validationOptions),
    IsNotEmpty(validationOptions),
  );
}
