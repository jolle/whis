import { WhoisParser } from '../src';

describe('WhoisParser', () => {
    it('ignores commented lines', () => {
        const { raw } = WhoisParser(
            '% commented line\n\nproperty: value\n% another comment'
        );
        expect(Object.keys(raw)).toHaveLength(1);
    });

    it('converts date properties to Date objects', () => {
        const date = new Date();
        const { expiration, created, updated } = WhoisParser(
            `expiry date: ${date}\ncreated: ${date}\nupdated date: ${date}`
        );

        const diff = (val: any) => Math.abs(date.getTime() - val.getTime());

        expect(diff(expiration)).toBeLessThanOrEqual(1000);
        expect(diff(created)).toBeLessThanOrEqual(1000);
        expect(diff(updated)).toBeLessThanOrEqual(1000);
    });

    it('returns properties with one value as a string', () => {
        const { domain } = WhoisParser('domain: anything');

        expect(domain).toEqual('anything');
    });

    it('returns properties with multiple values as an array', () => {
        const { domain } = WhoisParser(
            'domain: something\ndomain: anything\nbogus: value\ndomain: something else'
        );

        expect(domain).toBeInstanceOf(Array);
        expect(domain).toHaveLength(3);
        expect(domain).toContain('something');
        expect(domain).toContain('anything');
        expect(domain).toContain('something else');
    });

    it('detects tabs and spaces as delimeters', () => {
        const result = WhoisParser('domain: \t  \t \t\tvalue');

        expect(result).toHaveProperty('domain');
        expect(result.domain).toEqual('value');
    });
});