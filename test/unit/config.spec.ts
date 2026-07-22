import { describe, expect, it } from 'vitest';
import { envSchema } from '@/config';

describe('Env Schema Validation', () => {
  it('Should validate a correct environment configuration and apply domain defaults', () => {
    const validRawInput = {
      // Going through the minimal variations to test defaults:
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      REDIS_URL: 'redis://user:pass@localhost:6379',
      JWT_SECRET: 'super-secret-key-123',
      ARGON_SECRET_PEEPER: 'pepper-secret-456',
    };

    const parsed = envSchema.safeParse(validRawInput);
    expect(parsed.success).toBe(true);
    expect(parsed.data).toEqual({
      ...validRawInput,
      NODE_ENV: 'DEVELOPMENT',
      PORT: 3000,
      LOG_LEVEL: 'INFO',
      ARGON_SALT: 10,
      JWT_EXPIRES_IN: '1h',
    });
  });
});
