import { NotFoundError } from '../../../shared/errors/http-errors';
import type { UserRepository } from '../../users/repositories/user.repository';
import type { Service } from '../entities/service.entity';
import type { ServiceRepository } from '../repositories/service.repository';
import type {
  CreateServiceInput,
  ListServiceFilters,
  UpdateServiceInput,
} from '../schemas/service.schema';

/**
 * Regras de negócio de serviços. Depende de UserRepository para garantir
 * que o serviço seja vinculado a um usuário existente.
 */
export class ServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(input: CreateServiceInput): Promise<Service> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.serviceRepository.create(input);
  }

  list(filters: ListServiceFilters): Promise<Service[]> {
    return this.serviceRepository.list(filters);
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundError('Service not found');
    }
    return service;
  }

  async update(id: string, input: UpdateServiceInput): Promise<Service> {
    const service = await this.findById(id);
    return this.serviceRepository.update(service, input);
  }

  async delete(id: string): Promise<void> {
    const service = await this.findById(id);
    await this.serviceRepository.delete(service);
  }
}
