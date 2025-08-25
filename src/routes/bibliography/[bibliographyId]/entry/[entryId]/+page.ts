import { db } from '$lib/db';
import { hayagrivaService } from '$lib/services/hayagriva.service';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  try {
    let bibliography = await db.bibliographies.get(params.bibliographyId);
    let entry = bibliography?.data[params.entryId];

    if (!entry) {
      throw error(404, 'Entry not found');
    }

    let yamlData = hayagrivaService.export(entry) as string;
    let indentedYaml = yamlData
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');
    let fullYaml = `${params.entryId}:\n${indentedYaml}`;
    let entryYamlData = fullYaml.split('\n');

    return {
      entry,
      entryYamlData
    };
  } catch (err) {
    console.error('Error loading entry:', error);
    throw err;
    // throw error(500, 'Failed to load entry');
  }
};
