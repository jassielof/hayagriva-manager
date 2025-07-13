const SCHEMA_URL = 'https://jassielof.github.io/json-schemas/docs/hayagriva.schema.json';
const CACHE_KEY = 'hayagriva-entry-types';
const FALLBACK_TYPES = ['article', 'book', 'misc', 'web'];

// In-memory cache for the current session to avoid repeated localStorage access.
let sessionCachedEntryTypes: string[] | null = null;

async function fetchAndCacheTypes(): Promise<string[]> {
  try {
    const res = await fetch(SCHEMA_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch schema with status: ${res.status}`);
    }
    const schema = await res.json();
    const types = schema?.definitions?.entryType?.examples;

    if (Array.isArray(types) && types.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(types));
      sessionCachedEntryTypes = types;
      return types;
    }
    throw new Error('Entry types not found or empty in schema');
  } catch (e) {
    console.error('Schema fetch failed:', e);
    // Do not overwrite a potentially valid cache with fallback data.
    // Only return fallback if there's nothing else.
    const cachedData = getCachedTypes();
    if (cachedData) return cachedData;

    sessionCachedEntryTypes = FALLBACK_TYPES;
    return FALLBACK_TYPES;
  }
}

function getCachedTypes(): string[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('Failed to parse cached schema:', e);
    localStorage.removeItem(CACHE_KEY); // Clear corrupted cache
  }
  return null;
}

/**
 * Gets Hayagriva entry types, using a stale-while-revalidate cache.
 * 1. Returns in-memory cache if available.
 * 2. Returns localStorage cache if available, and triggers a background update.
 * 3. Fetches from network if no cache exists.
 */
export async function getEntryTypes(): Promise<string[]> {
  if (sessionCachedEntryTypes) {
    return sessionCachedEntryTypes;
  }

  const cachedData = getCachedTypes();

  if (cachedData) {
    // Use cached data immediately for a fast response.
    sessionCachedEntryTypes = cachedData;
    // Then, fetch in the background to check for updates.
    // We don't wait for this to finish.
    fetchAndCacheTypes();
    return cachedData;
  }

  // If no cache, fetch from the network and wait for the result.
  return await fetchAndCacheTypes();
}

export async function getLanguageRegex(): Promise<RegExp> {
  try {
    const schema = await fetch(SCHEMA_URL).then((res) => res.json());
    const pattern = schema?.definitions?.language?.pattern;
    return new RegExp(pattern);
  } catch (e) {
    console.error('Failed to fetch language regex from schema:', e);
    // Fallback: match any string
    return /.*/;
  }
}
