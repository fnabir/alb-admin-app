import { z } from 'zod';

export const transactionSchema = z.object({
  title: z.string().min(1, 'Required'),
  details: z.string().optional(),
  amount: z
    .number('Invalid input: number only. Set 0 if not want to set.')
    .min(0),
  date: z.date('Required'),
});

export type TransactionForm = z.infer<typeof transactionSchema>;
