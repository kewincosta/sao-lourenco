import { Attraction } from '@/shared/types';
import { dataSource } from './data-source';

export async function getAttractions(): Promise<Attraction[]> {
  return dataSource.attractions;
}

export async function getAttractionById(id: string): Promise<Attraction | null> {
  return dataSource.attractions.find((a) => a.id === id) || null;
}
