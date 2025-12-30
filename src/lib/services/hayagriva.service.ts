import type { Hayagriva, TopLevelEntry } from '$lib/types/hayagriva';
import YAML from 'yaml';

/**
 * Service for managing Hayagriva YAML files.
 */
export class HayagrivaService {
  private schemaCache: unknown = null;

  import(content: string) {
    const data = YAML.parse(content, {
      schema: 'core'
    });

    return data as Hayagriva;
  }

  export(
    content: Hayagriva | TopLevelEntry,
    options: {
      toClipboard?: boolean;
      asFile?: boolean;
      filename?: string;
    } = {}
  ) {
    const data = YAML.stringify(content, {
      schema: 'core'
    });

    if (options.toClipboard) return navigator.clipboard.writeText(data);

    if (options.asFile) {
      const blob = new Blob([data], { type: 'application/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = options.filename!;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return URL.revokeObjectURL(url);
    }

    return data;
  }

  async getSchema() {
    if (this.schemaCache) {
      return this.schemaCache;
    }

    const response = await fetch(
      'https://jassielof.github.io/json-schemas/docs/hayagriva.schema.json'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.statusText}`);
    }

    this.schemaCache = await response.json();
    return this.schemaCache;
  }
}

export const hayagrivaService = new HayagrivaService();
