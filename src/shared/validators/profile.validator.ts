import { z } from 'zod';

export const createIndividualProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dob: z.string().optional(), // ISO date string
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateIndividualProfileSchema = createIndividualProfileSchema.partial();

export type CreateIndividualProfileInput = z.infer<typeof createIndividualProfileSchema>;
export type UpdateIndividualProfileInput = z.infer<typeof updateIndividualProfileSchema>;
