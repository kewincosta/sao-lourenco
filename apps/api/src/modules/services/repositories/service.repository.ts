import type { FindOptionsWhere, Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import type { ListServiceFilters } from '../schemas/service.schema';

export class ServiceRepository {
  constructor(private readonly repository: Repository<Service>) {}

  async create(data: Partial<Service>): Promise<Service> {
    const service = this.repository.create(data);
    return this.repository.save(service);
  }

  findById(id: string): Promise<Service | null> {
    return this.repository.findOne({ where: { id } });
  }

  list(filters: ListServiceFilters): Promise<Service[]> {
    const where: FindOptionsWhere<Service> = {};
    if (filters.category) where.category = filters.category;
    if (filters.city) where.city = filters.city;
    if (filters.state) where.state = filters.state;

    return this.repository.find({ where, order: { createdAt: 'DESC' } });
  }

  async update(service: Service, data: Partial<Service>): Promise<Service> {
    Object.assign(service, data);
    return this.repository.save(service);
  }

  async delete(service: Service): Promise<void> {
    await this.repository.remove(service);
  }
}
