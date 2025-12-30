import type { HayagrivaDate } from '$lib/types/hayagriva';

export const DATE_REGEX = new RegExp(
  /^[+-~]?\d{4,}(-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/
);

export function dateFormatter(date: HayagrivaDate) {
  if (typeof date === 'number' || /^\d{4}$/.test(date)) return `${date}`;

  // Year and month ("YYYY-MM")
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(date)) {
    const d = new Date(`${date}-01`);
    return isNaN(d.getTime())
      ? date
      : new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'long'
        }).format(d);
  }

  // Full date ("YYYY-MM-DD")
  if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date)) {
    const d = new Date(date);
    return isNaN(d.getTime())
      ? date
      : new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(d);
  }

  // Fallback: return as-is
  return `${date}`;
}
