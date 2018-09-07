# whis

A very simple and minimal WHOIS library. WHOIS server is got from [whis-data](https://yarnpkg.com/en/package/whis-data) which updates every seven days (from IANA). Please report issues like missing or incorrect WHOIS server data to the [whis-data repository](https://github.com/jolle/whis-data).

## Usage

```
> yarn add whis
```

(or `npm install whis`)

### `whis(domain: string, raw?: boolean, server?: string) ⇒ Promise<WhoisData>`

### JavaScript (NodeJS)

```js
const { whis } = require('whis');

whis('jolle.io').then(data => console.log(data));
```

### TypeScript

TypeScript typings are included automatically. You do not need to install typings manually from an external repository or with the `@typings/*` packages.

```ts
import whis from 'whis';

whis('jolle.io').then(data => console.log(data));
```

### Advanced usage

```ts
import whis from 'whis';

whis('intranet-service.corporation', false, 'internal-whois.com').then(data =>
    console.log(data)
);
```
