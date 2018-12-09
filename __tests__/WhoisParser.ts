import { WhoisParser } from '../src';
import { parseWhois } from '../src/WhoisParser';

describe('WhoisParser', () => {
    it('ignores commented lines', () => {
        const raw = parseWhois(
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

    it('detects a non-existent domain', () => {
        const result = WhoisParser(
            'Domain not found.\r\n\r\nTerms of Use: Example Co.'
        );

        expect(result).toHaveProperty('exists');
        expect(result.exists).toBeFalsy();
    });

    it('detects an existent domain', () => {
        const result = WhoisParser(
            'somekey: somevalue\r\n\r\nTerms of Use: Example Co.'
        );

        expect(result).toHaveProperty('exists');
        expect(result.exists).toBeTruthy();
    });

    it('removes commented lines (>>> … <<<)', () => {
        expect(
            Object.keys(WhoisParser('>>> LAST UPDATE: NEVER <<<')).findIndex(
                key => key.startsWith('>')
            )
        ).toBe(-1);
    });

    it('removes commented lines (% …)', () => {
        expect(
            Object.keys(WhoisParser('% This is a disclaimer')).findIndex(key =>
                key.startsWith('%')
            )
        ).toBe(-1);
    });

    it('removes commented lines (# …)', () => {
        expect(
            Object.keys(WhoisParser('# This is a disclaimer')).findIndex(key =>
                key.startsWith('%')
            )
        ).toBe(-1);
    });
});
