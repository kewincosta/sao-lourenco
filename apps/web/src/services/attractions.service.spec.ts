import { beforeEach, describe, expect, it } from 'vitest';

import { resetDataSource } from './data-source';
import { mockAttractions } from './mock-data';
import { getAttractions, getAttractionById } from './attractions.service';

describe('attractions.service', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('getAttractions returns all attractions', async () => {
    const attractions = await getAttractions();
    expect(attractions).toEqual(mockAttractions);
  });

  it('getAttractionById returns the matching attraction', async () => {
    const attraction = await getAttractionById('1');
    expect(attraction).toEqual(mockAttractions.find((a) => a.id === '1'));
  });

  it('getAttractionById returns null when attraction is absent', async () => {
    const attraction = await getAttractionById('non-existent-id');
    expect(attraction).toBeNull();
  });
});
