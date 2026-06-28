import { describe, expect, it } from 'vitest';
import type { Service } from '@/shared/types';
import { filterServices } from './utils';

function makeService(overrides: Partial<Service>): Service {
  return {
    id: '1',
    userId: '1',
    name: 'Guia Turística',
    description: 'Passeios pela cidade',
    category: 'guide',
    images: [],
    whatsapp: '(35) 99999-9999',
    email: 'a@a.com',
    address: { street: 'Rua A', number: '1', neighborhood: 'Centro', city: 'SL', state: 'MG' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('filterServices', () => {
  const services: Service[] = [
    makeService({
      id: '1',
      name: 'Guia Turística',
      description: 'Passeios históricos',
      category: 'guide',
    }),
    makeService({
      id: '2',
      name: 'Pousada Serra Verde',
      description: 'Hospedagem família',
      category: 'inn',
    }),
    makeService({
      id: '3',
      name: 'Restaurante Sabor Mineiro',
      description: 'Comida típica',
      category: 'restaurant',
    }),
  ];

  it('returns all services when search is empty and category is "all"', () => {
    const result = filterServices(services, { search: '', category: 'all' });
    expect(result).toEqual(services);
  });

  it('filters by text matching the name (case-insensitive)', () => {
    const result = filterServices(services, { search: 'pousada', category: 'all' });
    expect(result).toEqual([services[1]]);
  });

  it('filters by text matching the description (case-insensitive)', () => {
    const result = filterServices(services, { search: 'históricos', category: 'all' });
    expect(result).toEqual([services[0]]);
  });

  it('filters by category', () => {
    const result = filterServices(services, { search: '', category: 'restaurant' });
    expect(result).toEqual([services[2]]);
  });

  it('combines text and category filters', () => {
    const result = filterServices(services, { search: 'serra', category: 'inn' });
    expect(result).toEqual([services[1]]);
  });

  it('returns an empty list when no service matches', () => {
    const result = filterServices(services, { search: 'inexistente', category: 'all' });
    expect(result).toEqual([]);
  });

  it('returns an empty list when text matches but category does not', () => {
    const result = filterServices(services, { search: 'pousada', category: 'restaurant' });
    expect(result).toEqual([]);
  });
});
