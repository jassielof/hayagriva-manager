import type { HayagrivaData } from './types/hayagriva-data';
import yaml from 'js-yaml';

export function parseYaml(content: string): HayagrivaData {
  const data = yaml.load(content);
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('Invalid YAML content: The root of a Hayagriva must be an object.');
  }

  return data as HayagrivaData;
}

export function exportYaml(data: HayagrivaData): string {
  return yaml.dump(data);
}
