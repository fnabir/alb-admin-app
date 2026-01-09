import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
});

export type LoginForm = z.infer<typeof loginSchema>;
