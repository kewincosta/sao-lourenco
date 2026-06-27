import type { FastifyInstance } from 'fastify';
import { makeServiceController } from '../factories/make-service-controller';

export async function serviceRoutes(app: FastifyInstance): Promise<void> {
  const controller = makeServiceController();

  app.post('/services', controller.create);
  app.get('/services', controller.list);
  app.get('/services/:id', controller.show);
  app.put('/services/:id', controller.update);
  app.delete('/services/:id', controller.remove);
}
