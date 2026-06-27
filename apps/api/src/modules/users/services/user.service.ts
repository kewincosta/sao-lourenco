import { ConflictError, NotFoundError } from '../../../shared/errors/http-errors';
import { onlyDigits } from '../../../shared/utils/document';
import type { User } from '../entities/user.entity';
import type { UserRepository } from '../repositories/user.repository';
import type { AuthUserInput, CreateUserInput, UpdateUserInput } from '../schemas/user.schema';

/**
 * Regras de negócio de usuários. O formato do documento (CPF/CNPJ) já foi
 * validado pelo schema; aqui tratamos unicidade e existência.
 */
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(input: CreateUserInput): Promise<User> {
    const document = onlyDigits(input.document); // persistimos sempre só os dígitos
    const existing = await this.userRepository.findByDocument(document);
    if (existing) {
      throw new ConflictError('Document already registered');
    }
    return this.userRepository.create({ ...input, document });
  }

  async authenticate(input: AuthUserInput): Promise<User> {
    const user = await this.userRepository.findByDocument(onlyDigits(input.document));
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.userRepository.update(user, input);
  }
}
