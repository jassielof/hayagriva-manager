import type { Person } from '$lib/types/hayagriva';

export function authorFormatter(author: Person | Person[]) {
  if (typeof author === 'string') {
    return author;
  }
}
