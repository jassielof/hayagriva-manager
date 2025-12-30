import { db } from '$lib/db';
import type { Bibliography } from '$lib/types/bibliography';
import type { TopLevelEntry } from '$lib/types/hayagriva';
import { error } from '@sveltejs/kit';

/**
 * Service for managing Hayagriva bibliographies and its entries in IndexedDB.
 */
export class BibliographyService {
  /**
   * Retrieves all bibliographies from the database.
   * @returns A promise that resolves to an array of all bibliographies.
   */
  static async getAll() {
    return await db.bibliographies.toArray();
  }

  /**
   * Retrieves a specific bibliography by its ID.
   * @param id - The unique identifier of the bibliography.
   * @returns A promise that resolves to the bibliography if found, undefined otherwise.
   */
  static async get(id: string) {
    const bibliography = await db.bibliographies.get(id);

    if (!bibliography) {
      error(404, { message: 'Bibliography not found' });
    }

    return bibliography;
  }

  /**
   * Adds a new bibliography to the database.
   * @param bibliography - The bibliography object to add.
   * @returns A promise that resolves when the bibliography has been added.
   */
  static async add(bibliography: Bibliography) {
    await db.bibliographies.add(JSON.parse(JSON.stringify(bibliography)));
  }

  /**
   * Deletes a bibliography from the database.
   * @param id - The unique identifier of the bibliography to delete.
   * @returns A promise that resolves when the bibliography has been deleted.
   */
  static async delete(id: string) {
    await db.bibliographies.delete(id);
  }

  /**
   * Updates specific fields of an existing bibliography.
   * @param id - The unique identifier of the bibliography to update.
   * @param changes - An object containing the fields to update.
   * @returns A promise that resolves when the bibliography has been updated.
   */
  static async update(id: string, changes: Partial<Bibliography>) {
    await db.bibliographies.update(id, changes);
  }

  static async exists(id: string) {
    return !!(await db.bibliographies.get(id));
  }

  static async updateMetadata(id: string, updated: Bibliography) {
    const newId = updated.metadata.id;

    if (newId == 'new') {
      error(400, {
        message: 'Bibliography ID cannot be "new" as it is reserved'
      });
    }

    if (newId !== id) {
      if (await this.exists(newId)) {
        error(409, { message: 'Bibliography with the new ID already exists' });
      }

      await this.delete(id);
    }

    await this.put(updated);
  }

  /**
   * Replaces an existing bibliography or adds a new one if it doesn't exist.
   * @param bibliography - The bibliography object to put.
   * @returns A promise that resolves when the bibliography has been saved.
   */
  static async put(bibliography: Bibliography) {
    await db.bibliographies.put(JSON.parse(JSON.stringify(bibliography)));
  }

  /**
   * Adds a new entry to a bibliography.
   * @param bibliographyId - The unique identifier of the bibliography.
   * @param newEntryId - The unique identifier for the new entry.
   * @param newEntryData - The entry data to add.
   * @throws {Error} If the bibliography is not found or if the entry already exists.
   * @returns A promise that resolves when the entry has been saved.
   */
  static async saveEntry(
    bibliographyId: string,
    newEntryId: string,
    newEntryData: TopLevelEntry
  ) {
    const bibliography = await this.get(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    if (bibliography.data[newEntryId]) {
      throw new Error('Entry already exists');
    }
    bibliography.data[newEntryId] = newEntryData;
    await this.put(bibliography);
  }

  /**
   * Deletes an entry from a bibliography.
   * @param bibliographyId - The unique identifier of the bibliography.
   * @param entryId - The unique identifier of the entry to delete.
   * @throws {Error} If the bibliography is not found.
   * @returns A promise that resolves when the entry has been deleted.
   */
  static async deleteEntry(bibliographyId: string, entryId: string) {
    const bibliography = await this.get(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    delete bibliography.data[entryId];
    await this.put(bibliography);
  }

  /**
   * Retrieves a specific entry from a bibliography.
   * @param bibliographyId - The unique identifier of the bibliography.
   * @param entryId - The unique identifier of the entry to retrieve.
   * @throws {Error} If the bibliography is not found.
   * @returns A promise that resolves to the entry data.
   */
  static async getEntry(bibliographyId: string, entryId: string) {
    const bibliography = await this.get(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    return bibliography.data[entryId];
  }

  /**
   * Updates an existing entry in a bibliography. If the entry ID changes, the old entry is deleted.
   * @param bibliographyId - The unique identifier of the bibliography.
   * @param updatedEntryId - The new or current unique identifier of the entry.
   * @param updatedEntryData - The updated entry data.
   * @param oldEntryId - The previous unique identifier of the entry (if the ID changed).
   * @throws {Error} If the bibliography is not found.
   * @returns A promise that resolves when the entry has been updated.
   */
  static async updateEntry(
    bibliographyId: string,
    updatedEntryId: string,
    updatedEntryData: TopLevelEntry,
    oldEntryId?: string
  ) {
    const bibliography = await this.get(bibliographyId);
    if (!bibliography) throw new Error('Bibliography not found');
    if (!bibliography.data[updatedEntryId]) {
      delete bibliography.data[oldEntryId!];
    }

    console.log('new data: ', updatedEntryData);

    bibliography.data[updatedEntryId] = updatedEntryData;
    await this.put(bibliography);
  }
}
