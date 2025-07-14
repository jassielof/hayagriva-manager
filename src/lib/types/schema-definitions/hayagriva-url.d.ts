import type { HayagrivaDate } from './hayagriva-date';

/**
 * Canonical public URL of the entry.
 */
export type HayagrivaUrl =
  | string
  | {
      value: string;
      accessedDate?: HayagrivaDate;
    };
