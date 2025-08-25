import { hayagrivaService } from '$lib/services/hayagriva.service';
import type { Language } from '$lib/types/hayagriva';

export const languagePattern = await hayagrivaService
  .getSchema()
  .then((schema) => schema.definitions.language.pattern);

const LANGUAGE_REGEX = new RegExp(languagePattern);

export function isValidLanguage(language: Language): boolean {
  return LANGUAGE_REGEX.test(language);
}
