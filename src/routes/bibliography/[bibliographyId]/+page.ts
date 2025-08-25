import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  try {
    const bibliography = await db.bibliographies.get(params.bibliographyId);

    if (!bibliography) {
      throw error(404, 'Bibliography not found');
    }

    return {
      bibliography
    };
  } catch (e) {
    console.error('Error loading bibliography:', error);
    throw error(500, 'Failed to load bibliography');
  }
};
