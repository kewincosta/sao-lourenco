import { User } from '@/shared/types';
import { dataSource } from './data-source';

export async function getUserById(id: string): Promise<User | null> {
  return dataSource.users.find((u) => u.id === id) || null;
}
