import type { Bibliography } from './types/bibliography';
import Dexie, { type Table } from 'dexie';
import type { BibliographyEntry } from './types/hayagriva';

/**
 * HayagrivaManagerDB is a Dexie database for managing bibliographies.
 * It provides CRUD operations for bibliographies and their entries.
 */
export class HayagrivaManagerDB extends Dexie {
  bibliographies!: Table<Bibliography, string>;

  constructor(dbName: string = 'hayagriva-manager', dbVersion: number = 1) {
    super(dbName);
    this.version(dbVersion).stores({
      bibliographies: 'metadata.id'
    });
  }

  async getAllBibliographies(): Promise<Bibliography[]> {
    return db.bibliographies.toArray();
  }

  async getBibliography(id: string): Promise<Bibliography | undefined> {
    return db.bibliographies.get(id);
  }

  async saveBibliography(bibliography: Bibliography): Promise<void> {
    await db.bibliographies.put(bibliography);
  }

  async deleteBibliography(id: string): Promise<void> {
    await db.bibliographies.delete(id);
  }

  async saveBibliographyEntry(
    bibliography: Bibliography,
    entryId: string,
    updateEntry: BibliographyEntry
  ): Promise<void> {
    bibliography.data[entryId] = updateEntry;
    await this.saveBibliography(bibliography);
  }
}

export const db = new HayagrivaManagerDB();
