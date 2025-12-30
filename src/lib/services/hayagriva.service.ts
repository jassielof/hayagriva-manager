import type { Hayagriva, TopLevelEntry } from '$lib/types/hayagriva';
import hayagrivaSchema from '../../../json-schemas/docs/hayagriva.schema.json';
import YAML from 'yaml';

/**
 * Service for managing Hayagriva YAML files.
 */
export class HayagrivaService {
  private readonly jsonSchema = hayagrivaSchema;

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

  static getSchema() {
    return this.prototype.jsonSchema;
  }
}

export const hayagrivaService = new HayagrivaService();
