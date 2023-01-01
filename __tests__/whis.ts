import whis, { whis as whisProp } from '../src';

const ECONNRESET_HOST = 'econnreset.local';

jest.mock('net');

describe('whis', () => {
  it('exports a default function', () => {
    expect(whis).toBeInstanceOf(Function);
  });

  it('exports an object with a property called `whis` identical to the default function', () => {
    expect(whisProp).toBeInstanceOf(Function);
    expect(whisProp).toEqual(whis);
  });

  it('retrieves correct WHOIS data', async () => {
    const data = await whis('anything', 'anything');

    expect(data).toHaveProperty('registrar');
    expect(data.registrar).toContain('NameCheap, Inc');
    expect(data).toHaveProperty('updated');

    expect(data.updated).toBeInstanceOf(Array);
    const updated = data.updated as Date[];
    expect(updated).toHaveLength(2);
    expect(updated[0]).toBeInstanceOf(Date);
    expect(updated[0]).toEqual(new Date('2018-08-19T15:07:30.000Z'));
  });

  it('handles ECONNRESET correctly', async () => {
    const fn = jest.fn();
    await whis('anything', ECONNRESET_HOST).catch(fn);
    expect(fn).toHaveBeenCalled();
  });
});
