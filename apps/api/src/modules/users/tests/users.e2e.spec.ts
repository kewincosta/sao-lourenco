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

describe('POST /users (E2E)', () => {
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

  const validPayload = () => ({
    name: faker.person.fullName(),
    document: generateValidCPF(),
    documentType: 'CPF' as const,
    email: faker.internet.email(),
    whatsapp: '+5511999998888',
    address: faker.location.streetAddress(),
  });

  it('cria um usuário e retorna 201 com o contrato esperado', async () => {
    const payload = validPayload();

    const response = await request(app.server).post('/users').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: payload.name,
      document: payload.document, // persistido apenas com dígitos
      documentType: 'CPF',
      email: payload.email,
      whatsapp: payload.whatsapp,
      address: payload.address,
    });
    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  it('retorna 409 quando o documento já está cadastrado', async () => {
    const payload = validPayload();
    await request(app.server).post('/users').send(payload);

    const response = await request(app.server)
      .post('/users')
      .send({ ...payload, email: faker.internet.email() });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ statusCode: 409, error: 'Conflict' });
  });

  it('retorna 400 quando o CPF é inválido', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ ...validPayload(), document: '12345678900' });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
  });

  it('retorna 400 quando o e-mail é inválido', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ ...validPayload(), email: 'not-an-email' });

    expect(response.status).toBe(400);
  });
});
