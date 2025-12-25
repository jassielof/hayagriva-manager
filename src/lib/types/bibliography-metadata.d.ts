import type { bibliographyMetadataSchema } from '$lib/schemas/bibliography-metadata';
import type z from 'zod';

/**
 * Bibliography Metadata type definition.
 */
export type BibliographyMetadata = z.infer<typeof bibliographyMetadataSchema>;
