import { describe, it, expect } from 'vitest';
import { createUserSchema } from '../src/shared/validators/user.validator';

describe('Validators', () => {
  it('validates create user payload', () => {
    const payload = { email: 'test@example.com', password: 'secret123' };
    const parsed = createUserSchema.parse(payload);
    expect(parsed.email).toBe('test@example.com');
  });
});
