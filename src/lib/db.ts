import type { Bibliography } from './types/bibliography';
import Dexie, { type Table } from 'dexie';
import type { BibliographyEntry, TopLevelEntry } from './types/hayagriva';

/**
 * HayagrivaManagerDB is a Dexie database for managing bibliographies.
 * It provides CRUD operations for bibliographies and their entries.
 */
export class HayagrivaManagerDB extends Dexie {
  bibliographies!: Table<Bibliography, string>;
  // TODO: Check if there's a need to explicitly enable persistency.
  constructor(dbName: string = 'hayagriva-manager', dbVersion: number = 1) {
    super(dbName);
    this.version(dbVersion).stores({
      bibliographies: 'metadata.id'
    });
  }

  async getAllBibliographies(): Promise<Bibliography[]> {
    return await db.bibliographies.toArray();
  }

  async getBibliography(id: string): Promise<Bibliography | undefined> {
    return await db.bibliographies.get(id);
  }

  async saveBibliography(bibliography: Bibliography): Promise<void> {
    await db.bibliographies.add(bibliography);
  }

  async deleteBibliography(id: string): Promise<void> {
    await db.bibliographies.delete(id);
  }

  async updateBibliography(bibliography: Bibliography): Promise<void> {
    await db.bibliographies.put(bibliography);
  }

  async saveBibliographyEntry(
    bibliographyId: string,
    entryId: string,
    updateEntry: TopLevelEntry
  ): Promise<void> {
    let bibliography = await this.getBibliography(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    bibliography.data[entryId] = updateEntry;
    await this.saveBibliography(bibliography);
  }
}

export const db = new HayagrivaManagerDB();
