import { describe, it, expect, beforeAll } from 'vitest';
import setup from '../integration/setup';
import { createUser, listUsers } from '../../src/server/users/service';

beforeAll(async () => {
  await setup();
}, 30000); // Increase timeout for MongoDB setup

describe('Users Service (integration)', () => {
  it('creates and lists users', async () => {
    const email = `user${Date.now()}@example.com`;
    const user = await createUser({ email, password: 'password123' });
    expect(user).toHaveProperty('email', email);

    const users = await listUsers(10);
    expect(Array.isArray(users)).toBe(true);
    expect(users.some((u: any) => u.email === email)).toBe(true);
  });
});
