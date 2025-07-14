export type Person =
  | string
  | {
      name: string;
      givenName?: string;
      prefix?: string;
      suffix?: string;
      alias?: string;
    };
