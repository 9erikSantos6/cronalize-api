import { config } from '@dotenvx/dotenvx';
import { z } from 'zod';

config({ path: ['.env.missing', '.env'], ignore: ['MISSING_ENV_FILE'] });

export const validLogLevels: string[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const;

export const validEnvs: string[] = ['DEVELOPMENT', 'PRODUCTION', 'TEST'] as const;

export const envSchema = z.object({
  NODE_ENV: z
    .string()
    .transform((val) => val.toUpperCase())
    .default('DEVELOPMENT')
    .pipe(z.enum(validEnvs))
    .nullable(),
  PORT: z
    .transform((val) => Number(val))
    .default(3000)
    .refine((num) => num >= 1024 && num <= 65535, {
      message: 'O valor de PORT deve um inteiro entre 1024 e 65535',
    })
    .nullable(),
  DATABASE_URL: z
    .url({ message: 'DATABASE_URL precisa ser uma URL válida' })
    .default('postgres://postgres:postgres@localhost:5432/cronalize')
    .refine((url) => url.startsWith('postgres://') || url.startsWith('postgresql://'), {
      message: 'DATABASE_URL precisa ser do protocolo Postgres (postgres:// ou postgresql://)',
    }),
  REDIS_URL: z
    .url({ message: 'REDIS_URL precisa ser uma URL válida' })
    .default('redis://localhost:6379')
    .refine((url) => url.startsWith('redis://') || url.startsWith('rediss://'), {
      message: 'REDIS_URL precisa ser do protocolo Redis (redis:// ou rediss://)',
    }),
  JWT_SECRET: z.string().min(6),
  JWT_EXPIRES_IN: z
    .string()
    .transform((val) => val.toLowerCase())
    .default('1h')
    .refine(
      (value) => {
        const timeUnits = ['h', 'm', 's'];
        const hasValidUnit = timeUnits.some((unit) => value.endsWith(unit));
        const hasValidNumber = /^\d+$/.test(value.slice(0, -1));
        return hasValidNumber && hasValidUnit;
      },
      { message: 'Formato de expiração do JWT inválido (ex: 1h, 30m, 15s)' },
    )
    .nullable(),
  ARGON_SECRET_PEEPER: z.string().min(6),
  ARGON_SALT: z.coerce.number().default(10).nullable(),
  LOG_LEVEL: z
    .string()
    .default('INFO')
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(validLogLevels))
    .nullable(),
});

export type Env = z.infer<typeof envSchema>;
export type LogLevel = Env['LOG_LEVEL'];
export type EnvName = Env['NODE_ENV'];

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Configuração inválida:\n${JSON.stringify(parsedEnv.error.issues, null, 2)}`);
}

export const env = parsedEnv.data;
