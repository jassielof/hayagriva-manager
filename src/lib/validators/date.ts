import { hayagrivaService } from '$lib/services/hayagriva.service';
import type { Date } from '$lib/types/hayagriva';

const hayagrivaSchema = await hayagrivaService.getSchema();
export const datePattern: string =
  hayagrivaSchema.definitions.date.anyOf.find((d: any) => d.pattern)?.pattern ??
  (() => {
    throw new Error('No date pattern found in schema');
  })();

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
