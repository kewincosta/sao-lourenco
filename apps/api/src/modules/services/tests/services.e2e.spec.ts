import { faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../../app';
import { resetMockDataSource } from '../../../test/mock-data-source';
import { generateValidCPF } from '../../../test/helpers';

vi.mock('../../../shared/database/data-source', async () => {
  const { getRepositoryMock } = await import('../../../test/mock-data-source');
  return { AppDataSource: { getRepository: getRepositoryMock } };
});

describe('Services (E2E)', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMockDataSource();
  });

  async function createUser(): Promise<string> {
    const response = await request(app.server).post('/users').send({
      name: faker.person.fullName(),
      document: generateValidCPF(),
      documentType: 'CPF',
      email: faker.internet.email(),
      whatsapp: '+5511999998888',
      address: faker.location.streetAddress(),
    });
    return response.body.id;
  }

  it('publica um serviço (201) e o lista (200)', async () => {
    const userId = await createUser();

    const create = await request(app.server).post('/services').send({
      userId,
      title: 'Pintura residencial',
      description: 'Pintura completa de apartamentos',
      category: 'reformas',
      price: 1500.5,
      city: 'São Paulo',
      state: 'SP',
    });

    expect(create.status).toBe(201);
    expect(create.body).toMatchObject({ userId, title: 'Pintura residencial', price: 1500.5 });
    expect(create.body.id).toEqual(expect.any(String));

    const list = await request(app.server).get('/services');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body).toHaveLength(1);
  });

  it('retorna 404 ao publicar serviço para usuário inexistente', async () => {
    const response = await request(app.server).post('/services').send({
      userId: faker.string.uuid(),
      title: 'Serviço órfão',
      description: 'desc',
      category: 'geral',
      price: 100,
      city: 'Rio de Janeiro',
      state: 'RJ',
    });

    expect(response.status).toBe(404);
  });
});
