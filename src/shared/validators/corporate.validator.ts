import { z } from 'zod';

export const createCorporateSchema = z.object({
  ownerId: z.string().length(24),
  companyName: z.string().min(1),
  address: z.string().optional(),
  website: z.string().url().optional(),
  logo: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateCorporateSchema = createCorporateSchema.partial();

export type CreateCorporateInput = z.infer<typeof createCorporateSchema>;
export type UpdateCorporateInput = z.infer<typeof updateCorporateSchema>;
