import { getHayagrivaSchema } from '$lib/hayagriva';
import type { Language } from '$lib/types/hayagriva';

const hayagrivaSchema = await getHayagrivaSchema();
const languagePattern = hayagrivaSchema.definitions.language.pattern;
const LANGUAGE_REGEX = new RegExp(languagePattern);

export function isValidLanguage(language: Language): boolean {
  return LANGUAGE_REGEX.test(language);
}
