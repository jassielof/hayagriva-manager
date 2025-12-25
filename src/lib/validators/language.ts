import type { Language } from '$lib/types/hayagriva';

// Language pattern from Hayagriva schema (ISO 639-1, 639-2, or 639-3)
// This avoids SSR fetch issues while keeping validation consistent
export const languagePattern = '^[a-z]{2,3}$';

const LANGUAGE_REGEX = new RegExp(languagePattern);

export function isValidLanguage(language: Language): boolean {
  return LANGUAGE_REGEX.test(language);
}
