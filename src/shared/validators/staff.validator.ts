import { z } from 'zod';

export const createStaffSchema = z.object({
  userId: z.string().length(24),
  corporateId: z.string().length(24),
  role: z.string().min(1),
  status: z.enum(['active', 'inactive', 'terminated']).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateStaffSchema = createStaffSchema.partial();

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
