import { hayagrivaService } from '$lib/services/hayagriva.service';
import type { Type } from '$lib/types/hayagriva';

export const ENTRY_TYPES: Type[] = await hayagrivaService
  .getSchema()
  .then((schema) => schema.definitions.entryType.examples);

/**
 * Checks if the provided entry type is valid.
 * @param entryType - The entry type to validate. These are case insensitive.
 */
export function isValidEntryType(entryType: Type): boolean {
  entryType = entryType.toLowerCase();
  return ENTRY_TYPES.includes(entryType);
}
