import { z } from 'zod';

export const createPaymentSchema = z.object({
  subjectType: z.enum(['USER', 'CORPORATE']),
  subjectId: z.string().length(24),
  stripeSessionId: z.string().optional(),
  amount: z.number().int().positive(),
  currency: z.string().min(3).optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
