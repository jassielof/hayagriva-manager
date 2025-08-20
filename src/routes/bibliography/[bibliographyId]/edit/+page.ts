import { db } from '$lib/db';
import type { Bibliography } from '$lib/types/bibliography';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  try {
    const oldBibliography = await db.bibliographies.get(params.bibliographyId);

    if (!oldBibliography) {
      throw error(404, 'Bibliography not found');
    }

    return {
      oldBibliography
    };
  } catch (err) {
    console.error('Error loading bibliography:', error);
    throw error(500, 'Failed to load bibliography');
  }
};
