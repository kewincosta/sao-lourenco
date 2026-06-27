import { createInMemoryRepository, type FakeRepository } from './in-memory-repository';

/**
 * Registry de fakes por entidade (classe). Garante que `AppDataSource.getRepository(Entity)`
 * devolva o MESMO fake singleton para todas as factories de um mesmo arquivo de teste —
 * requisito para as cadeias cross-domain (user→service, service→review) funcionarem,
 * já que `ServiceService`/`ReviewService` validam a existência via repositórios distintos
 * que precisam ver os mesmos dados.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EntityClass = new (...args: any[]) => { id: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry = new Map<EntityClass, FakeRepository<any>>();

/**
 * Substitui `AppDataSource.getRepository` nos testes. Use em conjunto com `vi.mock`:
 *
 * ```ts
 * vi.mock('../../../shared/database/data-source', () => ({
 *   AppDataSource: { getRepository: getRepositoryMock },
 * }));
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRepositoryMock<T extends { id: string }>(Entity: EntityClass): FakeRepository<T> {
  let fake = registry.get(Entity);
  if (!fake) {
    fake = createInMemoryRepository<T>();
    registry.set(Entity, fake);
  }
  return fake;
}

/** Limpa o estado de todos os fakes registrados. Chamar no `beforeEach`. */
export function resetMockDataSource(): void {
  for (const fake of registry.values()) {
    fake.clear();
  }
}
