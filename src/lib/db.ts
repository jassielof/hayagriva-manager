import type { Bibliography } from './types/bibliography';
import Dexie, { type Table } from 'dexie';
import type { BibliographyEntry } from './types/hayagriva';

const DB_NAME = 'hayagriva-manager';
const DB_VERSION = 1;

export class HayagrivaManagerDB extends Dexie {
  bibliographies!: Table<Bibliography, string>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
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
