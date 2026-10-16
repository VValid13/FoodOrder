import { IsStrongPassword, IsStrongPasswordOptions } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

const isStrongPasswordOptions: IsStrongPasswordOptions = {
  minLength: 12,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

const StrongPasswordMessage =
  'The Password must be at least 12 characters long, 1 lowercase letter, 1 uppercase letter, 1number and 1 symbol.';

export default function () {
  return applyDecorators(
    ApiProperty({ example: 'Pass1234*' }),
    IsStrongPassword(isStrongPasswordOptions, { message: StrongPasswordMessage }),
  );
}
