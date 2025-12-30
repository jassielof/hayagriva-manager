export const LANGUAGE_REGEX = new RegExp(
  /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2})?$/
);

export function getLanguageFlag(languageCode: string): string {
  // Match the region code (2 uppercase letters at the end): en-US, es-MX, etc.
  const match = languageCode.match(/-([A-Z]{2})$/);

  if (!match) {
    return ''; // No region code found (e.g., "en" or "zh-Hans")
  }

  const countryCode = match[1];

  // Convert country code to flag emoji
  // Each letter maps to a regional indicator symbol (A=🇦, B=🇧, etc.)
  const codePoints = countryCode
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}
