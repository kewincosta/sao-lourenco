import { beforeEach, describe, expect, it } from 'vitest';

import { resetDataSource } from './data-source';
import { mockUsers } from './mock-data';
import { login } from './auth.service';

describe('auth.service', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('login matches a user by normalized document (with punctuation) and returns the user', async () => {
    const seedUser = mockUsers[0];
    const user = await login(seedUser.document);
    expect(user).toEqual(seedUser);
  });

  it('login matches a user even when the input document has different formatting (only digits)', async () => {
    const seedUser = mockUsers[0];
    const digitsOnly = seedUser.document.replace(/\D/g, '');
    const user = await login(digitsOnly);
    expect(user).toEqual(seedUser);
  });

  it('login returns null when the document does not match any user', async () => {
    const user = await login('000.000.000-00');
    expect(user).toBeNull();
  });
});
