import { db } from '$lib/db';
import type { Bibliography } from '$lib/types/bibliography';
import type { TopLevelEntry } from '$lib/types/hayagriva';

/**
 * Service for managing Hayagriva bibliographies and its entries in IndexedDB.
 */
export class BibliographyService {
  async getAll(): Promise<Bibliography[]> {
    return await db.bibliographies.toArray();
  }

  async get(id: string): Promise<Bibliography | undefined> {
    return await db.bibliographies.get(id);
  }

  async save(bibliography: Bibliography): Promise<void> {
    // Save it sanitized, given that Dexie can't clone Svelte $states().
    await db.bibliographies.add(JSON.parse(JSON.stringify(bibliography)));
  }

  async delete(id: string): Promise<void> {
    await db.bibliographies.delete(id);
  }

  async update(bibliography: Bibliography): Promise<void> {
    await db.bibliographies.put(bibliography);
  }

  async saveEntry(
    bibliographyId: string,
    entryId: string,
    updateEntry: TopLevelEntry
  ): Promise<void> {
    let bibliography = await this.get(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    bibliography.data[entryId] = updateEntry;
    await this.save(bibliography);
  }

  async deleteEntry(bibliography: string, entryId: string) {
    let bib = await this.get(bibliography);
    if (!bib) throw new Error('Bibliography not found');
    delete bib.data[entryId];
    await this.update(bib);
  }
}

export const bibliographyService = new BibliographyService();
