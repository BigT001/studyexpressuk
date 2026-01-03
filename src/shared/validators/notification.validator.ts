import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().length(24),
  type: z.string().min(1),
  title: z.string().optional(),
  body: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
