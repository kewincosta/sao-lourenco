import type { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

/**
 * Encapsula o acesso a dados de User e isola o Service do TypeORM.
 * Recebe o Repository<User> por injeção (montado na factory).
 */
export class UserRepository {
  constructor(private readonly repository: Repository<User>) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByDocument(document: string): Promise<User | null> {
    return this.repository.findOne({ where: { document } });
  }

  async update(user: User, data: Partial<User>): Promise<User> {
    Object.assign(user, data);
    return this.repository.save(user);
  }
}
