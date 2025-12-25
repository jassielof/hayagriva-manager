import z from 'zod';

/**
 * List of reserved IDs that cannot be used for bibliographies IDs.
 */
const RESERVED_IDS = ['new', 'import'];

/**
 * Zod schema for the bibliography metadata.
 */
export const bibliographyMetadataSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .refine((id) => !RESERVED_IDS.includes(id), 'ID is reserved'),
  description: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  createdAt: z.date(),
  updatedAt: z.date()
});
