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

  async add(bibliography: Bibliography) {
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
    newEntryId: string,
    newEntryData: TopLevelEntry
  ) {
    let bibliography = await this.get(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    if (bibliography.data[newEntryId]) {
      throw new Error('Entry already exists');
    }
    bibliography.data[newEntryId] = newEntryData;
    await this.put(bibliography);
  }

  async deleteEntry(bibliographyId: string, entryId: string) {
    let bibliography = await this.get(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    delete bibliography.data[entryId];
    await this.put(bibliography);
  }

  async getEntry(bibliographyId: string, entryId: string) {
    const bibliography = await this.get(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    return bibliography.data[entryId];
  }

  async updateEntry(
    bibliographyId: string,
    updatedEntryId: string,
    updatedEntryData: TopLevelEntry,
    oldEntryId?: string
  ) {
    let bibliography = await this.get(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    if (!bibliography.data[updatedEntryId]) {
      delete bibliography.data[oldEntryId!];
    }

    console.log('new data: ', updatedEntryData);

    bibliography.data[updatedEntryId] = updatedEntryData;
    await this.put(bibliography);
  }
}

export const bibliographyService = new BibliographyService();
