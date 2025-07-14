/**
 *
 */
export type HayagrivaSerialNumber =
  | string
  | number
  | {
      DOI?: string;
      ISBN?: string;
      ISSN?: string;
      PMID?: string;
      PMCID?: string;
      arXiv?: string;
      serial?: string;
    };
