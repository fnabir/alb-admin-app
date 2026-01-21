import { z } from 'zod';
import { parse, isValid } from 'date-fns';

export const transactionSchema = z.object({
  title: z.string().min(1, 'Required'),
  details: z.string().optional(),
  amount: z
    .number('Invalid input: number only. Set 0 if not want to set.')
    .min(0),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine(
      (value) => {
        const date = parse(value, 'yyyy-MM-dd', new Date());
        return isValid(date);
      },
      { message: 'Invalid date format' }
    ),
});

export type TransactionForm = z.infer<typeof transactionSchema>;
