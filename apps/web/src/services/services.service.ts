import { Service } from '@/shared/types';
import { dataSource } from './data-source';

export type CreateServiceInput = Pick<
  Service,
  'name' | 'description' | 'category' | 'whatsapp' | 'email' | 'images' | 'address'
> & { userId: string };

export async function getServices(): Promise<Service[]> {
  return dataSource.services;
}

export async function getServiceById(id: string): Promise<Service | null> {
  return dataSource.services.find((s) => s.id === id) || null;
}

export async function getServicesByUser(userId: string): Promise<Service[]> {
  return dataSource.services.filter((s) => s.userId === userId);
}

export async function createService(input: CreateServiceInput): Promise<Service> {
  const now = new Date().toISOString();
  const service: Service = {
    id: Date.now().toString(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  dataSource.services.push(service);
  return service;
}

export async function deleteService(id: string): Promise<void> {
  dataSource.services = dataSource.services.filter((s) => s.id !== id);
}
