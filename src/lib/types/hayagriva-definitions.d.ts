export type FormattableStringObject = {
  value: string;
  short?: string;
  verbatim?: boolean;
};

export type FormattableString = string | FormattableStringObject;

export type HayagrivaDate = string | number;

export type PersonObject = {
  give?: string;
  family?: string;
  suffix?: string;
  'dropping-particle'?: string;
  'non-dropping-particle'?: string;
  [key: string]: any;
};

export type Person = PersonObject | string;

export type People = Person[];


export type NumberOrString = string | number;

export type Url =
  | string
  | {
      value: string;
      date?: string;
    };

