import type { FormattableString } from '$lib/types/hayagriva';

export function formattableStringFormatter(input: FormattableString) {
  if (typeof input === 'string') return input;

  return input.short ?? input.value ?? '';
}
