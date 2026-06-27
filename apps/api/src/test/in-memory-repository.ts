/**
 * Fake in-memory de `Repository<T>` do TypeORM, emulando apenas os 5 métodos
 * usados pelos repositórios da api: `create`, `save`, `findOne({ where })`,
 * `find({ where, order })` e `remove`. Não exercita SQL/migrations reais —
 * isso fica para a futura camada de testes "remotos" (AD-007).
 */

type WhereClause<T> = Partial<T>;

interface FindOneOptions<T> {
  where: WhereClause<T>;
}

interface FindManyOptions<T> {
  where?: WhereClause<T>;
  order?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
}

export interface FakeRepository<T extends { id: string }> {
  create(data: Partial<T>): T;
  save(entity: T): Promise<T>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  remove(entity: T): Promise<T>;
  /** Limpa o estado entre testes. */
  clear(): void;
}

function matches<T>(entity: T, where: WhereClause<T>): boolean {
  return Object.entries(where).every(([key, value]) => entity[key as keyof T] === value);
}

export function createInMemoryRepository<T extends { id: string }>(): FakeRepository<T> {
  const rows = new Map<string, T>();

  return {
    create(data: Partial<T>): T {
      return { ...data } as T;
    },

    async save(entity: T): Promise<T> {
      const now = new Date();
      const isNew = !entity.id;
      if (isNew) {
        entity.id = crypto.randomUUID();
      }
      if ('createdAt' in entity || isNew) {
        (entity as T & { createdAt?: Date }).createdAt =
          (entity as T & { createdAt?: Date }).createdAt ?? now;
      }
      if ('updatedAt' in entity) {
        (entity as T & { updatedAt?: Date }).updatedAt = now;
      }
      rows.set(entity.id, entity);
      return entity;
    },

    async findOne(options: FindOneOptions<T>): Promise<T | null> {
      for (const row of rows.values()) {
        if (matches(row, options.where)) {
          return row;
        }
      }
      return null;
    },

    async find(options?: FindManyOptions<T>): Promise<T[]> {
      let result = Array.from(rows.values());
      if (options?.where) {
        result = result.filter((row) => matches(row, options.where as WhereClause<T>));
      }
      if (options?.order) {
        const [field, direction] = Object.entries(options.order)[0] as [
          keyof T,
          'ASC' | 'DESC',
        ];
        result = [...result].sort((a, b) => {
          const aVal = a[field] as unknown as Date;
          const bVal = b[field] as unknown as Date;
          const diff = +new Date(aVal) - +new Date(bVal);
          return direction === 'ASC' ? diff : -diff;
        });
      }
      return result;
    },

    async remove(entity: T): Promise<T> {
      rows.delete(entity.id);
      return entity;
    },

    clear(): void {
      rows.clear();
    },
  };
}
