import { openDB, type IDBPDatabase } from 'idb';
import type { Bibliography } from './types/bibliography';

const DB_NAME = 'hayagriva-manager';
const DB_VERSION = 1;
const BIB_STORE_NAME = 'bibliographies';

let db: IDBPDatabase;

async function getDB(): Promise<IDBPDatabase> {
  if (!db) {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore(BIB_STORE_NAME, {
          keyPath: 'metadata.id'
        });
      }
    });
  }
  return db;
}

export async function getAllBibliographies(): Promise<Bibliography[]> {
  const db = await getDB();

  return db.getAll(BIB_STORE_NAME);
}

export async function getBibliography(id: string): Promise<Bibliography | undefined> {
  const db = await getDB();

  return db.get(BIB_STORE_NAME, id);
}

export async function saveBibliography(bibliography: Bibliography): Promise<void> {
  const db = await getDB();

  await db.put(BIB_STORE_NAME, bibliography);
}

export async function deleteBibliography(id: string): Promise<void> {
  const db = await getDB();

  await db.delete(BIB_STORE_NAME, id);
}
