import { User, Service, Review, Attraction } from '@/shared/types';
import { mockUsers, mockServices, mockReviews, mockAttractions } from './mock-data';

interface DataSource {
  users: User[];
  services: Service[];
  reviews: Review[];
  attractions: Attraction[];
}

function seedDataSource(): DataSource {
  return {
    users: structuredClone(mockUsers),
    services: structuredClone(mockServices),
    reviews: structuredClone(mockReviews),
    attractions: structuredClone(mockAttractions),
  };
}

export const dataSource: DataSource = seedDataSource();

export function resetDataSource(): void {
  const seeded = seedDataSource();
  dataSource.users = seeded.users;
  dataSource.services = seeded.services;
  dataSource.reviews = seeded.reviews;
  dataSource.attractions = seeded.attractions;
}
