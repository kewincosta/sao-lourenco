import { User } from '@/shared/types';
import { dataSource } from './data-source';

export async function login(document: string): Promise<User | null> {
  const normalized = document.replace(/\D/g, '');
  const foundUser = dataSource.users.find((u) => u.document.replace(/\D/g, '') === normalized);
  return foundUser || null;
}
