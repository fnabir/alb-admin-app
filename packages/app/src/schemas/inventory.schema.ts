import { z } from 'zod';

export const inventorySchema = z.object({
  item: z.string().trim().min(2, 'At least 2 characters required.'),
  count: z
    .number('Invalid input: number only. Set 0 if not in inventory.')
    .min(0),
});

export type InventoryForm = z.infer<typeof inventorySchema>;
