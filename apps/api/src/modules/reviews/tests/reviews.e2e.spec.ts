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

describe('POST /services/:id/reviews (E2E)', () => {
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

  async function createService(): Promise<string> {
    const user = await request(app.server).post('/users').send({
      name: faker.person.fullName(),
      document: generateValidCPF(),
      documentType: 'CPF',
      email: faker.internet.email(),
      whatsapp: '+5511999998888',
      address: faker.location.streetAddress(),
    });

    const service = await request(app.server).post('/services').send({
      userId: user.body.id,
      title: 'Encanador',
      description: 'Serviços hidráulicos',
      category: 'reparos',
      price: 200,
      city: 'Curitiba',
      state: 'PR',
    });

    return service.body.id;
  }

  it('cria uma avaliação (201) para um serviço existente', async () => {
    const serviceId = await createService();

    const response = await request(app.server)
      .post(`/services/${serviceId}/reviews`)
      .send({ rating: 5, comment: 'Excelente atendimento' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ serviceId, rating: 5, comment: 'Excelente atendimento' });
    expect(response.body.id).toEqual(expect.any(String));
  });

  it('retorna 400 quando o rating está fora do intervalo 1..5', async () => {
    const serviceId = await createService();

    const response = await request(app.server)
      .post(`/services/${serviceId}/reviews`)
      .send({ rating: 9 });

    expect(response.status).toBe(400);
  });

  it('retorna 404 ao avaliar um serviço inexistente', async () => {
    const response = await request(app.server)
      .post(`/services/${faker.string.uuid()}/reviews`)
      .send({ rating: 4 });

    expect(response.status).toBe(404);
  });
});
