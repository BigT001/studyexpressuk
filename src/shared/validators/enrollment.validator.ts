import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  userId: z.string().length(24),
  eventId: z.string().length(24),
});

export const updateEnrollmentSchema = z.object({
  progress: z.number().min(0).max(100).optional(),
  status: z.enum(['enrolled', 'in_progress', 'completed', 'cancelled']).optional(),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;
