import type { HayagrivaData } from './types/hayagriva-data';
import yaml from 'js-yaml';

export function parseYaml(content: string): HayagrivaData {
  const data = yaml;
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid YAML content');
  }

  return data as HayagrivaData;
}
