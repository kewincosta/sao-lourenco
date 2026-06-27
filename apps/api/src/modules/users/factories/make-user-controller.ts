import { AppDataSource } from '../../../shared/database/data-source';
import { UserController } from '../controllers/user.controller';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';

/**
 * Injeção de dependência manual (Factory Pattern):
 *   Repository<User> -> UserRepository -> UserService -> UserController
 */
export function makeUserRepository(): UserRepository {
  return new UserRepository(AppDataSource.getRepository(User));
}

export function makeUserController(): UserController {
  const service = new UserService(makeUserRepository());
  return new UserController(service);
}
