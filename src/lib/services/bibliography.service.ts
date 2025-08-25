import { db } from '$lib/db';
import type { Bibliography } from '$lib/types/bibliography';
import type { TopLevelEntry } from '$lib/types/hayagriva';

/**
 * Service for managing Hayagriva bibliographies and its entries in IndexedDB.
 */
export class BibliographyService {
  async getAll() {
    return await db.bibliographies.toArray();
  }

  async get(id: string) {
    return await db.bibliographies.get(id);
  }

  async save(bibliography: Bibliography) {
    // Save it sanitized, given that Dexie can't clone Svelte $states().
    await db.bibliographies.add(JSON.parse(JSON.stringify(bibliography)));
  }

  async delete(id: string) {
    await db.bibliographies.delete(id);
  }

  async update(id: string, changes: Partial<Bibliography>) {
    await db.bibliographies.update(id, changes);
  }

  async put(bibliography: Bibliography) {
    await db.bibliographies.put(JSON.parse(JSON.stringify(bibliography)));
  }

  async saveEntry(
    bibliographyId: string,
    entryId: string,
    updateEntry: TopLevelEntry
  ) {
    let bibliography = await this.get(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    bibliography.data[entryId] = updateEntry;
    await this.save(bibliography);
  }

  async deleteEntry(bibliographyId: string, entryId: string) {
    let bib = await this.get(bibliographyId);
    if (!bib) throw new Error('Bibliography not found');
    delete bib.data[entryId];
    await this.put(bib);
  }
}

export const bibliographyService = new BibliographyService();
