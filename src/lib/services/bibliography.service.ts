import { db } from '$lib/db';
import type { Bibliography } from '$lib/types/bibliography';
import type { TopLevelEntry } from '$lib/types/hayagriva';

export class BibliographyService {
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

  async deleteBibliographyEntry(bibliography: string, entryId: string) {
    let bib = await this.getBibliography(bibliography);
    if (!bib) throw new Error('Bibliography not found');
    delete bib.data[entryId];
    await this.updateBibliography(bib);
  }
}

export const bibliographyService = new BibliographyService();
