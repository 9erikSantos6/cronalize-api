import os from 'node:os';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import type { TEnv, TEnvInput } from '@/config';
import { getParsedEnv } from '@/config';
import { generateCharExcluding } from '@/utils';

describe('Env Schema Validation', () => {
  let validRawInput: TEnvInput;
  const osSystem = os.platform();
  const osTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
  });

  afterEach(() => {
    validRawInput = {} as TEnvInput;
  });

  test('Deve aplicar variaveis de ambinete implicitas: [OS_SYSTEM, OS_TIMEZONE]', () => {
    const validEnv = getParsedEnv(validRawInput);

    expect(validEnv.OS_SYSTEM).toBe(osSystem);
    expect(validEnv.OS_TIMEZONE).toBe(osTimezone);
  });

  test('Deve falahar se o valor da porta do API server for invalido', () => {
    const port = 99999;
    validRawInput.PORT = port;

    expect(() => getParsedEnv(validRawInput)).toThrow();
  });

  test('Deve retornar erro ao declarar valores invalidos no NODE_ENV', () => {
    const invalidValue = Math.floor(Math.random() * 0x1000000)
      .toString(8)
      .padStart(6, '0');
    validRawInput.NODE_ENV = String(invalidValue);

    expect(() => getParsedEnv(validRawInput)).toThrow();
  });

  test('Deve retornar erro ao declarar valores invalidos no LOG_LEVEL', () => {
    const invalidValue = Math.floor(Math.random() * 0x1000000)
      .toString(8)
      .padStart(6, '0');
    validRawInput.LOG_LEVEL = String(invalidValue);

    expect(() => getParsedEnv(validRawInput)).toThrow();
  });

  test('Deve retornar erro ao declarar chave < 6 caracteres no JWT_SECRET', () => {
    const invalidValue = 'asder';
    validRawInput.JWT_SECRET = invalidValue;

    expect(() => getParsedEnv(validRawInput)).toThrow();
  });

  test('Deve retornar erro ao declarar chave < 6 caracteres no JWT_SECRET', () => {
    const excludeChars = 'hms';
    const invalidValue = generateCharExcluding(excludeChars);
    validRawInput.JWT_EXPIRES_IN = `1${invalidValue}`;
    expect(() => getParsedEnv(validRawInput)).toThrow();
  });

  test('A URL must be created to access the database without relying exclusively on credentials.', () => {
    delete validRawInput.DATABASE_URL;

    const envData: TEnv = getParsedEnv(validRawInput);
    expect(envData?.DATABASE_URL).toBe(
      'postgres://cronalize_user:test-pswd@localhost:5432/cronalazie_db',
    );
  });

  test('It must return the complete environment variable if in TEST mode.', () => {
    const user = null;
    const nodeEnv = 'TEST';
    validRawInput.DATABASE_USER = user;
    validRawInput.NODE_ENV = nodeEnv;
    delete validRawInput.DATABASE_URL;

    const parsedEnv: TEnv = getParsedEnv(validRawInput);
    expect(parsedEnv).toEqual({
      ...validRawInput,
      DATABASE_USER: String(user),
      NODE_ENV: nodeEnv,
      DATABASE_URL: 'postgres://null:test-pswd@localhost:5432/cronalazie_db',
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
    const password = null;
    const nodeEnv = 'DEVELOPMENT';
    validRawInput.DATABASE_PASSWORD = password;
    validRawInput.NODE_ENV = nodeEnv;
    delete validRawInput.DATABASE_URL;

    const parsedEnv: TEnv = getParsedEnv(validRawInput);
    expect(parsedEnv).toEqual({
      ...validRawInput,
      DATABASE_PASSWORD: String(password),
      NODE_ENV: nodeEnv,
      DATABASE_URL: 'postgres://cronalize_user:null@localhost:5432/cronalazie_db',
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

  test('Deve priorizar o uso da URL postgres para conexão com banco de dados quando fornecida', () => {
    const custemURL = 'postgres://myuser:mypass@localhost:5432/mydb';
    validRawInput.DATABASE_URL = custemURL;
    const parsedEnv: TEnv = getParsedEnv(validRawInput);

    expect(parsedEnv.DATABASE_URL).toBe(custemURL);
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
