import { z } from 'zod';

export const forgetPasswordSchema = z.object({
  email: z.email('Invalid email'),
});

export type ForgetPasswordForm = z.infer<typeof forgetPasswordSchema>;
