import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import type { ValidationOptions } from 'class-validator';

const BOOLEAN_STRINGS: Record<string, boolean> = { true: true, false: false };

export function ToBoolean(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' && value in BOOLEAN_STRINGS ? BOOLEAN_STRINGS[value] : value,
    ),
    IsBoolean(validationOptions),
  );
}
