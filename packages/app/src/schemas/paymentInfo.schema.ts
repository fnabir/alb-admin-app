import { z } from 'zod';

export const paymentInfoSchema = z
  .object({
    project: z
      .string()
      .nonempty('Project Name is required')
      .refine((val) => val != 'Select', {
        error: 'Choose Project',
      }),
    type: z
      .string()
      .nonempty('Type is required')
      .refine((val) => val != 'Select', {
        error: 'Choose payment info type',
      }),
    details: z.string().nonempty('Details is required'),
  })
  .superRefine((data, ctx) => {
    const { type, details } = data;

    if (
      ['account', 'cellAccount', 'bKash', 'cell'].includes(type) &&
      !/^\d+$/.test(details)
    ) {
      ctx.addIssue({
        path: ['details'],
        code: 'custom',
        message: 'Details must be numbers only',
      });
    }

    if (['account', 'cellAccount'].includes(type) && details.length !== 8) {
      ctx.addIssue({
        path: ['details'],
        code: 'custom',
        message: 'Input last 8 digits of the account number',
      });
    }

    if (['bKash', 'cell'].includes(type) && details.length !== 11) {
      ctx.addIssue({
        path: ['details'],
        code: 'custom',
        message: 'Input the full 11 digits phone number',
      });
    }
  });

export type PaymentInfoForm = z.infer<typeof paymentInfoSchema>;
