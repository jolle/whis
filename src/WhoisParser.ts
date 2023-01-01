type ModifierFn = (input: string) => unknown;

// Tries to convert dates in string-form to an actual Date object.
const dateModifier: ModifierFn = (input) =>
  isNaN(+new Date(input)) ? input : new Date(input);

const aliasKeys: {
  from: string[];
  to: string;
  modifier?: ModifierFn;
}[] = [
  {
    from: ['domain name', 'domain'],
    to: 'domain',
  },
  {
    from: ['expiry date', 'registry expiry date'],
    to: 'expiration',
    modifier: dateModifier,
  },
  {
    from: ['created', 'creation date'],
    to: 'created',
    modifier: dateModifier,
  },
  {
    from: ['updated date', 'last-update'],
    to: 'updated',
    modifier: dateModifier,
  },
  {
    from: ['status', 'domain status'],
    to: 'status',
  },
  {
    from: ['registrar'],
    to: 'registrar',
  },
  {
    from: ['registrar iana id'],
    to: 'registrarIANAId',
  },
  {
    from: ['registrar abuse contact email'],
    to: 'registrarAbuseContactEmail',
  },
  {
    from: ['registrar abuse contact phone'],
    to: 'registrarAbuseContactPhone',
  },
  {
    from: ['name server', 'nserver'],
    to: 'nameServer',
  },
  {
    from: ['dnssec'],
    to: 'DNSSEC',
  },
];

const nonExistentSignatures = [
  'NOT FOUND',
  'No Data Found',
  'No match for',
  'This domain name has not been registered.',
  'Domain not found',
  'The queried object does not exist',
  'El dominio no se encuentra registrado',
  'is available for registration',
  'is free',
  'Invalid domain name',
  'Domain Not Found',
  'Object does not exist',
  'domain name not known',
  'No matching record.',
  'No information was found matching that query.',
  'not found...',
  'syntax error in specified domain name',
  'NO MATCH',
  'No entries found',
  'not found',
  'The domain has not been registered',
];

/**
 * Filters out commented lines and converts every line to a
 * JS object key–value pair with multiple values made into an array.
 *
 * @param {[key: string]: string | string[]} data – the raw WHOIS response data
 */
export const parseWhois = (
  data: string,
): { [key: string]: string | string[] } =>
  data
    .split(/\r?\n/)
    .filter((line) => line.length > 0 && !['#', '%', '>'].includes(line[0]))
    .map((line) => line.split(/:(\s+)/))
    .map(([key, _, ...values]) => ({
      key,
      value: values.join(':').trim(),
    }))
    .reduce<Record<string, string | string[]>>(
      (previous, { key, value }: { key: string; value: string }) => {
        const previousValue = previous[key];

        return {
          ...previous,
          [key]: previousValue // if there is already a property using the same key, create an array containing all values.
            ? [
                ...(previousValue instanceof Array
                  ? previousValue
                  : [previousValue]),
                value,
              ]
            : value,
        };
      },
      {},
    );

/**
 * Tries to find an alias and a modifier by the key.
 * Provies a default modifier function that returns the argument if no modifier found.
 *
 * @param {string} key – the key that'll be used to find the alias
 */
const findAliasByKey = (key: string): { to: string; modifier: ModifierFn } => ({
  to: key,
  modifier: (a) => a, // these will be overridden by the spreading if an actual modifier is found
  ...(aliasKeys.find(({ from }) => from.includes(key.toLowerCase())) ?? {}),
});

type OneOrMultiple<T> = T | T[];

export interface WhoisResult {
  domain?: OneOrMultiple<string>;
  expiration?: OneOrMultiple<Date>;
  created?: OneOrMultiple<Date>;
  updated?: OneOrMultiple<Date>;
  status?: OneOrMultiple<string>;
  registrar?: OneOrMultiple<string>;
  registrarIANAId?: OneOrMultiple<string>;
  registrarAbuseContactEmail?: OneOrMultiple<string>;
  registrarAbuseContactPhone?: OneOrMultiple<string>;
  nameServer?: OneOrMultiple<string>;
  DNSSEC?: OneOrMultiple<string>;
  exists: boolean;

  /** this is a string | string[] */
  [key: string]: unknown; // 😔 https://github.com/microsoft/TypeScript/issues/17867
}

/**
 * Parses given raw WHOIS data to JS object form
 *
 * @param {string} data – raw WHOIS data to parse from
 */
export default (data: string): WhoisResult => ({
  exists:
    nonExistentSignatures.findIndex((sign) =>
      new RegExp(sign, 'i').test(data),
    ) === -1,
  ...Object.fromEntries(
    Object.entries(parseWhois(data))
      .map(([key, value]) => ({ value, alias: findAliasByKey(key) }))
      .map<[string, unknown]>(({ value, alias }) => [
        alias.to,
        value instanceof Array
          ? value.map(alias.modifier)
          : alias.modifier(value),
      ]),
  ),
});
