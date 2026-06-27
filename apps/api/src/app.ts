import 'reflect-metadata';
import Fastify, { type FastifyInstance } from 'fastify';
import { reviewRoutes } from './modules/reviews/routes/review.routes';
import { serviceRoutes } from './modules/services/routes/service.routes';
import { userRoutes } from './modules/users/routes/user.routes';
import { registerErrorHandler } from './shared/middlewares/error-handler';

/**
 * Monta a instância Fastify (sem dar listen) para ser reutilizada tanto pelo
 * servidor quanto pelos testes E2E (Supertest contra `app.server`).
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test',
  });

  registerErrorHandler(app);

  app.get('/health', async () => ({ status: 'ok' }));

  await app.register(userRoutes);
  await app.register(serviceRoutes);
  await app.register(reviewRoutes);

  return app;
}
