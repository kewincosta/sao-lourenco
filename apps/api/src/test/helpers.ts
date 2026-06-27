import { AppDataSource } from '../shared/database/data-source';

/** Inicializa o DataSource de teste e garante o schema (idempotente). */
export async function initTestDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  await AppDataSource.runMigrations();
}

export async function closeTestDatabase(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}

/** Limpa os dados entre os testes mantendo o schema/migrations. */
export async function truncateDatabase(): Promise<void> {
  await AppDataSource.query(
    'TRUNCATE TABLE "reviews", "services", "users" RESTART IDENTITY CASCADE',
  );
}

// --- Geradores de documentos válidos (dígitos verificadores corretos) ---

export function generateValidCPF(): string {
  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

  const digit = (numbers: number[]): number => {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      sum += numbers[i] * (numbers.length + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const d1 = digit(base);
  const d2 = digit([...base, d1]);
  return [...base, d1, d2].join('');
}

export function generateValidCNPJ(): string {
  // 8 dígitos de raiz + filial 0001
  const base = [...Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)), 0, 0, 0, 1];

  const digit = (numbers: number[]): number => {
    const weights =
      numbers.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      sum += numbers[i] * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const d1 = digit(base);
  const d2 = digit([...base, d1]);
  return [...base, d1, d2].join('');
}
