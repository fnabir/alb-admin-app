import { z } from 'zod';

export const callbackSchema = z.object({
  project: z
    .string()
    .nonempty('Project Name is required')
    .refine((val) => val != '', {
      error: 'Choose Project',
    }),
  details: z.string().nonempty('Required'),
  name: z.string().optional(),
  date: z.string().nonempty('Required'),
  status: z.string().nonempty('Required'),
});

export type CallbackForm = z.infer<typeof callbackSchema>;
