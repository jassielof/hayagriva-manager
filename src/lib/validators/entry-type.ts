import type { Type } from '$lib/types/hayagriva';

// Static list of entry types from Hayagriva schema
// This avoids SSR fetch issues while keeping validation consistent
export const ENTRY_TYPES: Type[] = [
  'article',
  'chapter',
  'entry',
  'anthos',
  'report',
  'thesis',
  'web',
  'scene',
  'artwork',
  'patent',
  'case',
  'newspaper',
  'legislation',
  'manuscript',
  'original',
  'post',
  'misc',
  'performance',
  'periodical',
  'proceedings',
  'book',
  'blog',
  'reference',
  'conference',
  'anthology',
  'repository',
  'thread',
  'video',
  'audio',
  'exhibition'
];

/**
 * Checks if the provided entry type is valid.
 * @param entryType - The entry type to validate. These are case insensitive.
 */
export function isValidEntryType(entryType: Type): boolean {
  const normalized = entryType.toLowerCase() as Type;
  return ENTRY_TYPES.includes(normalized);
}
