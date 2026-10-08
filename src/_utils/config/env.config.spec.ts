import { validateEnv } from './env.config.js';

const SECRET_VALUE = 'super-secret-value';

function buildValidConfig(): Record<string, unknown> {
  return {
    PORT: '3000',
    FRONT_ORIGIN: 'http://localhost:5173',
    DATABASE_URL: 'postgres://user:password@localhost:5432/foodorder',
    JWT_SECRET: SECRET_VALUE,
    JWT_REFRESH_SECRET: SECRET_VALUE,
    S3_ENDPOINT: 'http://localhost:9000',
    S3_REGION: 'us-east-1',
    S3_ACCESS_KEY: 'access-key',
    S3_SECRET_KEY: SECRET_VALUE,
    S3_BUCKET: 'foodorder',
  };
}

describe('validateEnv', () => {
  it('accepts a complete configuration and converts PORT to a number', () => {
    expect(validateEnv(buildValidConfig()).PORT).toBe(3000);
  });

  it('lists every missing variable', () => {
    const { JWT_SECRET: _jwtSecret, S3_BUCKET: _s3Bucket, ...config } = buildValidConfig();

    expect(() => validateEnv(config)).toThrow(/JWT_SECRET[\s\S]*S3_BUCKET/);
  });

  it('rejects an invalid port', () => {
    expect(() => validateEnv({ ...buildValidConfig(), PORT: 'not-a-port' })).toThrow('PORT');
  });

  it('rejects a blank secret', () => {
    expect(() => validateEnv({ ...buildValidConfig(), JWT_SECRET: '   ' })).toThrow('JWT_SECRET');
  });

  it('never includes values in the error message', () => {
    expect(() => validateEnv({ ...buildValidConfig(), FRONT_ORIGIN: SECRET_VALUE })).toThrow(
      expect.objectContaining({ message: expect.not.stringContaining(SECRET_VALUE) }),
    );
  });
});
