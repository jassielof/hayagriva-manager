import type { Bibliography } from './types/bibliography';
import Dexie, { type Table } from 'dexie';

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
}

export const db = new HayagrivaManagerDB();
