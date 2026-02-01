import z from 'zod';

export const offerSchema = z.object({
  name: z.string().nonempty('Required'),
  address: z.string().optional(),
  product: z.string().nonempty('Required'),
  work: z.string().nonempty('Required'),
  unit: z.number().min(0),
  floor: z.string().optional(),
  person: z.string().optional(),
  shaft: z.string().optional(),
  note: z.string().max(500, 'Note too long').optional(),
  refer: z.string().optional(),
  status: z.string().nonempty('Required'),
});

export type OfferForm = z.infer<typeof offerSchema>;
