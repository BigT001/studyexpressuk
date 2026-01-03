import { z } from 'zod';

export const createMembershipSchema = z.object({
  subjectType: z.enum(['USER', 'CORPORATE']),
  subjectId: z.string().length(24),
  planId: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const purchaseMembershipSchema = z.object({
  subjectType: z.enum(['USER', 'CORPORATE']),
  subjectId: z.string().length(24),
  planId: z.string().min(1),
  amount: z.number().int().positive(),
  currency: z.string().min(3).optional(),
});

export type CreateMembershipInput = z.infer<typeof createMembershipSchema>;
export type PurchaseMembershipInput = z.infer<typeof purchaseMembershipSchema>;
