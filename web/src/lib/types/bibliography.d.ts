import type { BibliographyMetadata } from './bibliography-metadata';
import type { HayagrivaData } from './hayagriva-data';

export interface Bibliography {
  metadata: BibliographyMetadata;
  data: HayagrivaData;
}
