import { db } from '$lib/db';
import { dumpSingleHayagriva } from '$lib/hayagriva';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  let bibliography = await db.bibliographies.get(params.bibliographyId);
  let entry = bibliography?.data[params.entryId];

  if (!entry) {
    throw new Error('Entry not found');
  }

  let yamlData = dumpSingleHayagriva(entry);
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
};
