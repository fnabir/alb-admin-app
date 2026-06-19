import { z } from 'zod';

export const projectInfoSchema = z.object({
  location: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  phone: z.string().trim().max(11).optional(),
  servicing: z
    .number('Invalid input: number only. Set 0 if not want to set.')
    .min(0),
  cancelled: z.boolean().optional(),
});

export type ProjectInfoForm = z.infer<typeof projectInfoSchema>;
