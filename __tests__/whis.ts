import whis, { whis as whisProp } from '../src';

jest.mock('net');

describe('whis', () => {
  it('exports a default function', () => {
    expect(whis).toBeInstanceOf(Function);
  });

  it('exports an object with a property called `whis` identical to the default function', () => {
    expect(whisProp).toBeInstanceOf(Function);
    expect(whisProp).toEqual(whis);
  });

  it('retrieves correct WHOIS data', () => {
    expect.assertions(5);

    return whis('anything', 'anything').then((data: any) => {
      expect(data).toBeInstanceOf(Object);

      expect(data).toHaveProperty('registrar');
      expect(data.registrar).toContain('NameCheap, Inc');

      expect(data).toHaveProperty('updated');
      expect(data.updated[0]).toBeInstanceOf(Date);
    });
  });
});
