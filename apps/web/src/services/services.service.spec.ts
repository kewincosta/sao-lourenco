import { beforeEach, describe, expect, it } from 'vitest';

import { resetDataSource, dataSource } from './data-source';
import { mockServices } from './mock-data';
import {
  getServices,
  getServiceById,
  getServicesByUser,
  createService,
  deleteService,
} from './services.service';

describe('services.service', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('getServices returns all services', async () => {
    const services = await getServices();
    expect(services).toEqual(mockServices);
  });

  it('getServiceById returns the matching service', async () => {
    const service = await getServiceById('1');
    expect(service).toEqual(mockServices.find((s) => s.id === '1'));
  });

  it('getServiceById returns null when service is absent', async () => {
    const service = await getServiceById('non-existent-id');
    expect(service).toBeNull();
  });

  it('getServicesByUser returns only services for that user', async () => {
    const services = await getServicesByUser('1');
    expect(services).toEqual(mockServices.filter((s) => s.userId === '1'));
    expect(services.every((s) => s.userId === '1')).toBe(true);
  });

  it('createService adds a new service to the data-source', async () => {
    const initialLength = dataSource.services.length;
    const created = await createService({
      userId: '1',
      name: 'New Service',
      description: 'Description',
      category: 'guide',
      images: [],
      whatsapp: '(35) 99999-9999',
      email: 'new@email.com',
      address: { street: 'Street', number: '1', neighborhood: 'N', city: 'C', state: 'MG' },
    });

    expect(created.name).toBe('New Service');
    expect(created.id).toBeDefined();
    expect(created.createdAt).toBeDefined();
    expect(created.updatedAt).toBeDefined();
    expect(dataSource.services.length).toBe(initialLength + 1);
    expect(dataSource.services).toContainEqual(created);
  });

  it('deleteService removes a seed service by id', async () => {
    const seedId = mockServices[0].id;
    await deleteService(seedId);
    expect(dataSource.services.find((s) => s.id === seedId)).toBeUndefined();
    expect(dataSource.services.length).toBe(mockServices.length - 1);
  });

  it('deleteService removes a user-created service by id', async () => {
    const created = await createService({
      userId: '1',
      name: 'Temp Service',
      description: 'Description',
      category: 'guide',
      images: [],
      whatsapp: '(35) 99999-9999',
      email: 'new@email.com',
      address: { street: 'Street', number: '1', neighborhood: 'N', city: 'C', state: 'MG' },
    });
    const lengthAfterCreate = dataSource.services.length;

    await deleteService(created.id);

    expect(dataSource.services.find((s) => s.id === created.id)).toBeUndefined();
    expect(dataSource.services.length).toBe(lengthAfterCreate - 1);
  });
});
