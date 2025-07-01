import { openDB, type IDBPDatabase } from 'idb';
import type { Bibliography } from './types/bibliography';
import Dexie, { type Table } from 'dexie';

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
}

export const db = new HayagrivaManagerDB();

export async function getAllBibliographies(): Promise<Bibliography[]> {
  return db.bibliographies.toArray();
}

export async function getBibliography(id: string): Promise<Bibliography | undefined> {
  return db.bibliographies.get(id);
}

export async function saveBibliography(bibliography: Bibliography): Promise<void> {
  await db.bibliographies.put(bibliography);
}

export async function deleteBibliography(id: string): Promise<void> {
  await db.bibliographies.delete(id);
}
