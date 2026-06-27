import type { FastifyInstance } from 'fastify';
import { makeUserController } from '../factories/make-user-controller';

export async function userRoutes(app: FastifyInstance): Promise<void> {
  const controller = makeUserController();

  app.post('/users', controller.create);
  app.post('/users/auth', controller.authenticate);
  app.put('/users/:id', controller.update);
}
