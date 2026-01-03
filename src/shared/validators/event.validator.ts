import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['event', 'course']).optional(),
  access: z.enum(['free', 'premium', 'corporate']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  createdBy: z.string().length(24).optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
