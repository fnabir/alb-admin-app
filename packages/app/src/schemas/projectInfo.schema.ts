import { z } from 'zod';

export const projectInfoSchema = z.object({
  location: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  phone: z.string().trim().max(11).optional(),
  servicing: z.number().min(0),
});

export type ProjectInfoForm = z.infer<typeof projectInfoSchema>;
