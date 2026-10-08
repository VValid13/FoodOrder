import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { IsNotEmptyString } from './is-not-empty-string.decorator.js';

class SampleDto {
  @IsNotEmptyString()
  name: string;
}

async function validateName(name: unknown) {
  const dto = plainToInstance(SampleDto, { name });
  const errors = await validate(dto);
  return { dto, errors };
}

describe('IsNotEmptyString', () => {
  it('accepts a non empty string and trims it', async () => {
    const { dto, errors } = await validateName('  Pizza  ');

    expect(errors).toHaveLength(0);
    expect(dto.name).toBe('Pizza');
  });

  it('rejects an empty string', async () => {
    const { errors } = await validateName('');

    expect(errors[0]?.constraints).toHaveProperty('isNotEmpty');
  });

  it('rejects a string made of spaces', async () => {
    const { errors } = await validateName('   ');

    expect(errors[0]?.constraints).toHaveProperty('isNotEmpty');
  });

  it('rejects a value that is not a string', async () => {
    const { errors } = await validateName(42);

    expect(errors[0]?.constraints).toHaveProperty('isString');
  });

  it('rejects a missing value', async () => {
    const { errors } = await validateName(undefined);

    expect(errors[0]?.constraints).toHaveProperty('isNotEmpty');
  });
});
