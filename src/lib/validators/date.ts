import type { Date } from '$lib/types/hayagriva';

// Date pattern from Hayagriva schema (YYYY, YYYY-MM, or YYYY-MM-DD)
// This avoids SSR fetch issues while keeping validation consistent
export const datePattern: string = '^-?\\d{1,4}(-\\d{2}){0,2}$';

export const DATE_REGEX = new RegExp(datePattern);

export function isValidDate(date: Date): boolean {
  if (date === undefined || date === null) return false;

  if (typeof date === 'number' && Number.isInteger(date)) {
    return true;
  }

  if (typeof date === 'string') {
    return DATE_REGEX.test(date);
  }

  return false;
}
