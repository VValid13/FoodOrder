import { getRequiredEnv } from './get-required-env.helper.js';

const VARIABLE_NAME = 'FOODORDER_TEST_VARIABLE';

describe('getRequiredEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns the value when the variable is set', () => {
    vi.stubEnv(VARIABLE_NAME, 'value');

    expect(getRequiredEnv(VARIABLE_NAME)).toBe('value');
  });

  it('throws when the variable is missing', () => {
    vi.stubEnv(VARIABLE_NAME, undefined);

    expect(() => getRequiredEnv(VARIABLE_NAME)).toThrow(VARIABLE_NAME);
  });

  it('throws when the variable is blank', () => {
    vi.stubEnv(VARIABLE_NAME, '   ');

    expect(() => getRequiredEnv(VARIABLE_NAME)).toThrow(VARIABLE_NAME);
  });
});
