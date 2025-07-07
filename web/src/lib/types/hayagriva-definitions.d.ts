export type FormattableStringObject = {
  value: string;
  short?: string;
  verbatim?: boolean;
};

export type FormattableString = string | FormattableStringObject;

export type HayagrivaDate = string | number;
