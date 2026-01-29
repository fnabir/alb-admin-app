import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().trim().min(2, 'At least 3 characters required.'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val.length === 0) return true;
        return /^01\d{9}$/.test(val);
      },
      {
        message: 'Phone must be 11 digits and start with 01',
      },
    ),
});

export type UserForm = z.infer<typeof userSchema>;
