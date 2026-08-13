import os from 'node:os';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { getParsedEnv, type TEnvInput } from '@/config';

describe('Env Schema Validation', () => {
  let validRawInput: TEnvInput;
  let osSystem: string;
  let osTimezone: string;

  beforeEach(() => {
    validRawInput = {
      DATABASE_URL: 'postgres://cronalize_user:test-pswd@localhost:5432/cronalazie_db',
      DATABASE_USER: 'cronalize_user',
      DATABASE_PASSWORD: 'test-pswd',
      DATABASE_DB: 'cronalazie_db',
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: '5432',
      DATABASE_TZ: 'America/Fortaleza',
      REDIS_URL: 'redis://user:pass@localhost:6379',
      JWT_SECRET: 'super-secret-key-123',
      ARGON_SECRET_PEEPER: 'pepper-secret-456',
    } as TEnvInput;
    osSystem = os.platform();
    osTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  });

  afterEach(() => {
    validRawInput = {} as TEnvInput;
  });

  test('A URL must be created to access the database without relying exclusively on credentials.', () => {
    delete validRawInput.DATABASE_URL;

    const envData = getParsedEnv(validRawInput);
    expect(envData?.DATABASE_URL).toBe(
      'postgres://cronalize_user:test-pswd@localhost:5432/cronalazie_db',
    );
  });

  test('It must return the complete environment variable if in TEST mode.', () => {
    validRawInput.DATABASE_USER = '';
    validRawInput.NODE_ENV = 'TEST';
    delete validRawInput.DATABASE_URL;

    const parsedEnv = getParsedEnv(validRawInput);
    expect(parsedEnv).toEqual({
      ...validRawInput,
      DATABASE_USER: '',
      DATABASE_URL: 'postgres://:test-pswd@localhost:5432/cronalazie_db',
      NODE_ENV: 'TEST',
      DATABASE_PORT: 5432,
      OS_SYSTEM: osSystem,
      OS_TIMEZONE: osTimezone,
      PORT: 3000,
      LOG_LEVEL: 'INFO',
      ARGON_SALT: 10,
      JWT_EXPIRES_IN: '1h',
    });
  });
  test('It must return the complete environment variable if in DEVELOPMENT.', () => {
    validRawInput.DATABASE_PASSWORD = '';
    validRawInput.NODE_ENV = 'DEVELOPMENT';
    delete validRawInput.DATABASE_URL;

    const parsedEnv = getParsedEnv(validRawInput);
    expect(parsedEnv).toEqual({
      ...validRawInput,
      DATABASE_PASSWORD: '',
      NODE_ENV: 'DEVELOPMENT',
      DATABASE_URL: 'postgres://cronalize_user:@localhost:5432/cronalazie_db',
      DATABASE_PORT: 5432,
      OS_SYSTEM: osSystem,
      OS_TIMEZONE: osTimezone,
      PORT: 3000,
      LOG_LEVEL: 'INFO',
      ARGON_SALT: 10,
      JWT_EXPIRES_IN: '1h',
    });
  });

  test('It must return the complete environment variable if in PRODUCTION', () => {
    validRawInput.DATABASE_USER = '';
    validRawInput.NODE_ENV = 'PRODUCTION';
    delete validRawInput.DATABASE_URL;

    expect(() => {
      getParsedEnv(validRawInput);
    }).toThrow();
  });

  test('Should validate a correct environment configuration and apply domain defaults', () => {
    const envData = getParsedEnv(validRawInput);
    expect(envData).toEqual({
      ...validRawInput,
      DATABASE_PORT: 5432,
      OS_SYSTEM: osSystem,
      OS_TIMEZONE: osTimezone,
      DATABASE_URL: 'postgres://cronalize_user:test-pswd@localhost:5432/cronalazie_db',
      NODE_ENV: 'DEVELOPMENT',
      PORT: 3000,
      LOG_LEVEL: 'INFO',
      ARGON_SALT: 10,
      JWT_EXPIRES_IN: '1h',
    });
  });
});
