import yaml from 'js-yaml';
import type { Hayagriva } from './types/hayagriva';

const SCHEMA_URL =
  'https://jassielof.github.io/json-schemas/docs/hayagriva.schema.json';

/**
 * Parse YAML content into a Hayagriva bibliography object.
 */
export function parseYaml(content: string): Hayagriva {
  const data = yaml.load(content);
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error(
      'Invalid YAML content: The root of a Hayagriva must be an object.'
    );
  }

  return data as Hayagriva;
}

/**
 * Export a Hayagriva bibliography object to YAML format.
 */
export function exportYaml(data: Hayagriva): string {
  return yaml.dump(data);
}

let schemaPromise: Promise<any> | null = null;

/**
 * Fetch the Hayagriva schema from the specified URL.
 * Returns a promise that resolves to the schema object.
 */
export async function getHayagrivaSchema(): Promise<any> {
  if (!schemaPromise) {
    schemaPromise = await fetch(SCHEMA_URL).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch schema: ${response.statusText}`);
      }
      return response.json();
    });
  }
  
  return schemaPromise;
}
