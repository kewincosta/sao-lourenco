import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../../config/env';
import { User } from '../../modules/users/entities/user.entity';
import { Service } from '../../modules/services/entities/service.entity';
import { Review } from '../../modules/reviews/entities/review.entity';
import { InitialSchema1700000000000 } from './migrations/1700000000000-InitialSchema';

/**
 * Fonte de dados única da aplicação. Entities e migrations são importadas
 * explicitamente (sem globs) para funcionar igual sob tsx, tsc e vitest.
 * `synchronize: false` — o schema é gerido apenas por migrations.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.databaseName,
  synchronize: false,
  logging: env.NODE_ENV === 'development',
  entities: [User, Service, Review],
  migrations: [InitialSchema1700000000000],
});
