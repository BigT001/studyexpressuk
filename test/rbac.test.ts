import { describe, it, expect } from 'vitest';
import { isRoleAllowed } from '../src/server/auth/rbac';

describe('RBAC helper', () => {
  it('allows roles that are in the allowed list', () => {
    expect(isRoleAllowed('ADMIN', ['ADMIN'])).toBe(true);
    expect(isRoleAllowed('SUB_ADMIN', ['ADMIN', 'SUB_ADMIN'])).toBe(true);
  });

  it('denies missing or unexpected roles', () => {
    expect(isRoleAllowed(undefined, ['ADMIN'])).toBe(false);
    expect(isRoleAllowed('INDIVIDUAL', ['ADMIN'])).toBe(false);
  });
});
