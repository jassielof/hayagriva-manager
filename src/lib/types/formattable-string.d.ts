import type { ShortForm, Value, Verbatim } from './hayagriva';

export type FormattableString =
  | string
  | { value: Value; shortForm?: ShortForm; verbatim?: Verbatim };
