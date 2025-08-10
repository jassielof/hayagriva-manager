import yaml from 'js-yaml';
import type { Hayagriva, TopLevelEntry } from './types/hayagriva';

const SCHEMA_URL =
  'https://jassielof.github.io/json-schemas/docs/hayagriva.schema.json';

/**
 * Parse YAML content into a Hayagriva bibliography object.
 */
export function loadHayagrivaYaml(content: string): Hayagriva {
  const data = yaml.load(content, { schema: yaml.CORE_SCHEMA });

  return data as Hayagriva;
}

export function loadSingleHayagriva(content: string) {
  const data = yaml.load(content, { schema: yaml.CORE_SCHEMA });

  return data as TopLevelEntry;
}

export function dumpHayagrivaYaml(content: Hayagriva) {
  const data = yaml.dump(content, { schema: yaml.CORE_SCHEMA });

  return data;
}

let schemaCache: any = null;
let schemaPromise: Promise<any> | null = null;

export async function getHayagrivaSchema(): Promise<any> {
  if (schemaCache) return schemaCache;

  if (schemaPromise) return schemaPromise;

  schemaPromise = fetch(SCHEMA_URL)
    .then((response) => response.json())
    .then((schema) => {
      schemaCache = schema;
      schemaPromise = null;
      return schema;
    });

  return schemaPromise;
}
