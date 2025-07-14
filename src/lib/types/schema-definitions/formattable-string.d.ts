export type FormattableString =
  | string
  | {
      value: string;
      verbatim?: boolean;
      short?: string;
    };
