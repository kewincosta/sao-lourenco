import { AppDataSource } from '../../../shared/database/data-source';
import { makeUserRepository } from '../../users/factories/make-user-controller';
import { ServiceController } from '../controllers/service.controller';
import { Service } from '../entities/service.entity';
import { ServiceRepository } from '../repositories/service.repository';
import { ServiceService } from '../services/service.service';

export function makeServiceRepository(): ServiceRepository {
  return new ServiceRepository(AppDataSource.getRepository(Service));
}

export function makeServiceController(): ServiceController {
  // Cross-domínio: o ServiceService precisa do UserRepository para validar o dono.
  const service = new ServiceService(makeServiceRepository(), makeUserRepository());
  return new ServiceController(service);
}
