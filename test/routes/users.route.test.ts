import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as usersRoute from '../../app/api/users/route';

// Mock session helper to simulate ADMIN role
vi.mock('../../src/server/auth/session', () => ({
  getServerAuthSession: async () => ({ user: { role: 'ADMIN', id: 'test' } }),
}));

describe('Users route', () => {
  it('GET /api/users returns users when admin', async () => {
    const res = await usersRoute.GET();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.users)).toBe(true);
  });
});
