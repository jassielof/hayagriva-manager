import { db } from '$lib/db';
import type { Bibliography } from '$lib/types/bibliography';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async () => {
  let bibliographies: Bibliography[] = await db.bibliographies.toArray();
  return { bibliographies };
};
