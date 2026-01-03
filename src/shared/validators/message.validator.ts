import { z } from 'zod';

export const createMessageSchema = z.object({
  senderId: z.string().length(24),
  recipientId: z.string().length(24),
  content: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
