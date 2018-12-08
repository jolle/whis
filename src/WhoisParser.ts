// Tries to convert dates in string-form to an actual Date object.
const dateModifier = () => (input: any): any =>
    input instanceof Array
        ? input.map(a => dateModifier()(a))
        : isNaN(+new Date(input))
        ? input
        : new Date(input);

const aliasKeys = [
    {
        from: ['domain name', 'domain'],
        to: 'domain'
    },
    {
        from: ['expiry date', 'registry expiry date'],
        to: 'expiration',
        modifier: dateModifier()
    },
    {
        from: ['created', 'creation date'],
        to: 'created',
        modifier: dateModifier()
    },
    {
        from: ['updated date', 'last-update'],
        to: 'updated',
        modifier: dateModifier()
    },
    {
        from: ['status', 'domain status'],
        to: 'status'
    },
    {
        from: ['registrar'],
        to: 'registrar'
    },
    {
        from: ['registrar iana id'],
        to: 'registrarIANAId'
    },
    {
        from: ['registrar abuse contact email'],
        to: 'registrarAbuseContactEmail'
    },
    {
        from: ['registrar abuse contact phone'],
        to: 'registrarAbuseContactPhone'
    },
    {
        from: ['name server', 'nserver'],
        to: 'nameServer'
    },
    {
        from: ['dnssec'],
        to: 'DNSSEC'
    }
];

/**
 * Filters out commeted lines and converts every line to a
 * JS object key–value pair with multiple values made into an array.
 *
 * @param {[key: string]: string | string[]} data – the raw WHOIS response data
 */
const parseWhois = (data: string): { [key: string]: string | string[] } =>
    data
        .split('\n')
        .filter(line => line.length > 0 && !line.startsWith('%'))
        .map(line => line.split(/:\s+/))
        .map(line => ({
            key: line[0].trim(),
            value: line
                .slice(1)
                .join(': ') // if there happens to be `: ` somewhere in the property value, this will restore them (not accounting for extra spaces)
                .trim()
        }))
        .reduce(
            (
                previous: any,
                { key, value }: { key: string; value: string }
            ) => ({
                ...previous,
                ...{
                    [key]: previous[key] // if there is already a property using the same key, create an array containing all values.
                        ? [
                              ...(previous[key] instanceof Array
                                  ? previous[key]
                                  : [previous[key]]),
                              value
                          ]
                        : value
                }
            }),
            {}
        );

/**
 * Tries to find an alias and a modifier by the key.
 * Provies a default modifier function that returns the argument if no modifier found.
 *
 * @param {string} key – the key that'll be used to find the alias
 */
const findAliasByKey = (key: string): any => ({
    modifier: (a: any) => a, // this will be overridden by the spreading if an actual modifier is found
    ...(aliasKeys.find(({ from }) => from.includes(key.toLowerCase())) || {
        notFound: true
    })
});

export interface WhoisResult {
    domain?: string | string[];
    expiration?: Date;
    created?: Date;
    updated?: Date;
    status?: string | string[];
    registrar?: string | string[];
    registrarIANAId?: string | string[];
    registrarAbuseContactEmail?: string | string[];
    registrarAbuseContactPhone?: string | string[];
    nameServer?: string | string[];
    DNSSEC?: string | string[];
    [unknownKey: string]: any;
    raw: any;
}

/**
 * Parses given raw WHOIS data to JS object form
 *
 * @param {string} data – raw WHOIS data to parse from
 */
export default (data: string): WhoisResult => {
    const whoisData = parseWhois(data);
    return {
        ...Object.keys(whoisData)
            .map(key => ({ key, alias: findAliasByKey(key) }))
            .filter(({ alias }) => !alias.notFound)
            .map(({ key, alias }) => ({
                [alias.to]: alias.modifier(whoisData[key])
            }))
            .reduce((p, n) => ({ ...p, ...n }), {}),
        raw: whoisData
    };
};
