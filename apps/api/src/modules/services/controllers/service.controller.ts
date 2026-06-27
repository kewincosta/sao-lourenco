import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ServiceService } from '../services/service.service';
import {
  createServiceSchema,
  listServiceQuerySchema,
  serviceIdParamSchema,
  updateServiceSchema,
} from '../schemas/service.schema';

export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = createServiceSchema.parse(request.body);
    const service = await this.serviceService.create(data);
    return reply.status(201).send(service);
  };

  list = async (request: FastifyRequest, reply: FastifyReply) => {
    const filters = listServiceQuerySchema.parse(request.query);
    const services = await this.serviceService.list(filters);
    return reply.status(200).send(services);
  };

  show = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = serviceIdParamSchema.parse(request.params);
    const service = await this.serviceService.findById(id);
    return reply.status(200).send(service);
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = serviceIdParamSchema.parse(request.params);
    const data = updateServiceSchema.parse(request.body);
    const service = await this.serviceService.update(id, data);
    return reply.status(200).send(service);
  };

  remove = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = serviceIdParamSchema.parse(request.params);
    await this.serviceService.delete(id);
    return reply.status(204).send();
  };
}
