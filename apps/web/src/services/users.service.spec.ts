import { beforeEach, describe, expect, it } from 'vitest';

import { resetDataSource } from './data-source';
import { mockUsers } from './mock-data';
import { getUserById } from './users.service';

describe('users.service', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('getUserById returns the matching user', async () => {
    const user = await getUserById('1');
    expect(user).toEqual(mockUsers.find((u) => u.id === '1'));
  });

  it('getUserById returns null when user is absent', async () => {
    const user = await getUserById('non-existent-id');
    expect(user).toBeNull();
  });
});
