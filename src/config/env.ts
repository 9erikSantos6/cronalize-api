import os from 'node:os';
import { config } from '@dotenvx/dotenvx';
import { z } from 'zod';

config({ path: ['.env.missing', '.env'], ignore: ['MISSING_ENV_FILE'] });

const LOG_LEVEL = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const;
const ENVIRONMENT = ['DEVELOPMENT', 'PRODUCTION', 'TEST'] as const;

const SYSTEM_TIME_ZONE: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
const OS_SYSTEM: string = os.platform();

const portSchema = z.coerce
  .number()
  .int()
  .min(1024, 'A porta deve ser maior ou igual a 1024')
  .max(65535, 'A porta deve ser menor ou igual a 65535');

const systemEnvSchema = z.object({
  OS_TIMEZONE: z.string().default(SYSTEM_TIME_ZONE).optional(),
  OS_SYSTEM: z.string().default(OS_SYSTEM).optional(),
  NODE_ENV: z
    .string()
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(ENVIRONMENT))
    .optional()
    .default('DEVELOPMENT'),
  LOG_LEVEL: z
    .string()
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(LOG_LEVEL))
    .optional()
    .default('INFO'),
});

const authEnvSchema = z.object({
  JWT_SECRET: z.string().min(6),
  JWT_EXPIRES_IN: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine(
      (value) => {
        const timeUnits = ['h', 'm', 's'];
        const hasValidUnit = timeUnits.some((unit) => value.endsWith(unit));
        const hasValidNumber = /^\d+$/.test(value.slice(0, -1));
        return hasValidNumber && hasValidUnit;
      },
      { message: 'Formato de expiração do JWT inválido (ex: 1h, 30m, 15s)' },
    )
    .optional()
    .default('1h'),
  ARGON_SECRET_PEEPER: z.string().min(6),
  ARGON_SALT: z.coerce.number().default(10).optional(),
});

const databaseEnvSchema = z.object({
  DATABASE_HOST: z.coerce.string().optional(),
  DATABASE_PORT: portSchema.optional(),
  DATABASE_USER: z.coerce.string().optional(),
  DATABASE_PASSWORD: z.coerce.string().optional(),
  DATABASE_DB: z.coerce.string().optional(),
  DATABASE_TZ: z.coerce.string().optional(),
  DATABASE_SSL: z.coerce.boolean().optional(),
  DATABASE_URL: z
    .url({ message: 'DATABASE_URL precisa ser uma URL válida' })
    .refine((url) => url.startsWith('postgres://') || url.startsWith('postgresql://'), {
      message: 'DATABASE_URL precisa ser do protocolo Postgres (postgres:// ou postgresql://)',
    })
    .optional(),
  REDIS_URL: z
    .url({ message: 'REDIS_URL precisa ser uma URL válida' })
    .refine((url) => url.startsWith('redis://') || url.startsWith('rediss://'), {
      message: 'REDIS_URL precisa ser do protocolo Redis (redis:// ou rediss://)',
    })
    .default('redis://localhost:6379'),
});

const serverEnvSchema = z.object({
  PORT: portSchema.default(3000).optional(),
});

const envSchema = z
  .object({
    ...systemEnvSchema.shape,
    ...authEnvSchema.shape,
    ...databaseEnvSchema.shape,
    ...serverEnvSchema.shape,
  })
  .superRefine((env, ctx) => {
    if (env.DATABASE_URL) {
      console.warn('AVISO: DATABASE_URL foi declarada no seu ambiente, priorizaremos o uso');
      return;
    }

    if (env.NODE_ENV === 'DEVELOPMENT' || env.NODE_ENV === 'TEST') return;

    const databaseExpected = [
      'DATABASE_HOST',
      'DATABASE_PORT',
      'DATABASE_USER',
      'DATABASE_PASSWORD',
      'DATABASE_DB',
    ] as const;

    const missingVars: string[] = [];

    for (const key of databaseExpected) {
      if (!env[key]) {
        missingVars.push(key);
      }
    }

    if (missingVars.length > 0) {
      ctx.addIssue({
        code: 'custom',
        message: `As seguintes variáveis de ambiente obrigatórias do banco de dados não foram definidas: ${missingVars.join(', ')}`,
        path: ['DATABASE_URL'],
      });
    }
  })
  .transform((env) => ({
    ...env,
    DATABASE_URL:
      env.DATABASE_URL ??
      `postgres://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_DB}`,
  }));

export type TEnvInput = z.input<typeof envSchema>;
export type TEnvOutput = z.output<typeof envSchema>;

const parseWithCustomError = <T extends z.ZodTypeAny>(schema: T, data: z.input<T>): z.output<T> => {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const errorMessages = parsed.error.issues
      .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Erro ao validar variáveis de ambiente!\n${errorMessages}`);
  }

  return parsed.data;
};

export const getParsedEnv = (data: TEnvInput): TEnvOutput => {
  return parseWithCustomError(envSchema, data);
};

const environment = process.env as TEnvInput;

export const env: TEnvOutput = getParsedEnv({
  ...environment,
  NODE_ENV: process.env.NODE_ENV?.toLocaleUpperCase(),
  LOG_LEVEL: process.env.LOG_LEVEL?.toLocaleUpperCase(),
  OS_SYSTEM: OS_SYSTEM,
  OS_TIMEZONE: SYSTEM_TIME_ZONE,
});
