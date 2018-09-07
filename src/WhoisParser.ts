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
        to: 'registrarAbuseContactEmail'
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

const parseWhois = (data: string) =>
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

const findAliasByKey = (key: string): any => ({
    modifier: (a: any) => a,
    ...(aliasKeys.find(({ from }) => from.includes(key.toLowerCase())) || {
        notFound: true
    })
});

/**
 * Parses given raw WHOIS data to JS object form
 *
 * @param {string} data – raw WHOIS data to parse from
 */
export default (data: string): any => {
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
