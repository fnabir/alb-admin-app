import z from 'zod';

export const websiteSchema = z.object({
  note: z.string().max(500, 'Note too long').optional(),
  status: z.string().nonempty('Required'),
});

export type WebsiteForm = z.infer<typeof websiteSchema>;
