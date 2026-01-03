import { z } from 'zod';
import { UserRole } from '../../server/db/models/user.model';

export const createUserSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(6).max(20).optional(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(6).max(20).optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
