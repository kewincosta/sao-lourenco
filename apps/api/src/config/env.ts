import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DB_HOST: z.string().min(1).default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USER: z.string().min(1),
  DB_PASS: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_NAME_TEST: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Falha cedo e de forma explícita se o ambiente estiver mal configurado.
  console.error('❌ Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors);
  throw new Error('Variáveis de ambiente inválidas. Verifique seu arquivo .env');
}

const data = parsed.data;

// Em ambiente de testes usamos um banco dedicado para não tocar nos dados de dev.
const databaseName =
  data.NODE_ENV === 'test' && data.DB_NAME_TEST ? data.DB_NAME_TEST : data.DB_NAME;

export const env = { ...data, databaseName };
