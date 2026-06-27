import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UserService } from '../services/user.service';
import {
  authUserSchema,
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from '../schemas/user.schema';

/**
 * Recebe a requisição, valida a entrada (Zod) e delega ao Service.
 * Sem regra de negócio aqui. Métodos como arrow para preservar o `this`
 * quando passados como handlers das rotas.
 */
export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = createUserSchema.parse(request.body);
    const user = await this.userService.create(data);
    return reply.status(201).send(user);
  };

  authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = authUserSchema.parse(request.body);
    const user = await this.userService.authenticate(data);
    return reply.status(200).send(user);
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = userIdParamSchema.parse(request.params);
    const data = updateUserSchema.parse(request.body);
    const user = await this.userService.update(id, data);
    return reply.status(200).send(user);
  };
}
