import type { Hayagriva, TopLevelEntry } from '$lib/types/hayagriva';
import YAML from 'yaml';

/**
 * Service for managing Hayagriva YAML files.
 */
export class HayagrivaService {
  readonly JSON_SCHEMA_URL =
    'https://jassielof.github.io/json-schemas/docs/hayagriva.schema.json';
  private schemaCache: any = null;
  private schemaPromise: Promise<any> | null = null;

  import(content: string, asTopLevelEntry: boolean = false) {
    const data = YAML.parse(content, {
      schema: 'core'
    });

    return asTopLevelEntry ? (data as TopLevelEntry) : (data as Hayagriva);
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
    if (this.schemaCache) return this.schemaCache;
    if (this.schemaPromise) return this.schemaPromise;

    this.schemaPromise = fetch(this.JSON_SCHEMA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch schema: ${response.status}`);
        }
        return response.json();
      })
      .then((schema) => {
        this.schemaCache = schema;
        this.schemaPromise = null;
        return schema;
      })
      .catch((error) => {
        this.schemaPromise = null;
        throw error;
      });

    return this.schemaPromise;
  }
}

export const hayagrivaService = new HayagrivaService();
