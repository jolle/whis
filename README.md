# whis

[![Build Status](https://travis-ci.org/jolle/whis.svg?branch=master)](https://travis-ci.org/jolle/whis)

A very simple and minimal WHOIS library. WHOIS server is got from [whis-data](https://yarnpkg.com/en/package/whis-data) which updates every seven days (from IANA). Please report issues like missing or incorrect WHOIS server data to the [whis-data repository](https://github.com/jolle/whis-data).

## Usage

```sh
$ yarn add whis
```

(or `npm install whis`)

### `whis(domain: string, server?: string) ⇒ Promise<WhoisData>`

### `getRaw(domain: string, server?: string) ⇒ Promise<string>`

### JavaScript (NodeJS)

```js
const { whis } = require('whis');

whis('jolle.io').then(data => console.log(data));
```

```js
const { getRaw } = require('whis');

getRaw('jolle.io').then(data => console.log(data)); // this will print the raw WHOIS response
```

### TypeScript (and ES6+)

TypeScript typings are included automatically. You do not need to install typings manually from an external repository or with the `@typings/*` packages.

```ts
import whis from 'whis';

whis('jolle.io').then(data => console.log(data));
```

```ts
import { getRaw } from 'whis';

getRaw('jolle.io').then(data => console.log(data)); // this will print the raw WHOIS response
```

### Advanced usage

```ts
import whis from 'whis';

whis('intranet-service.corporation', 'internal-whois.com').then(data =>
    console.log(data)
); // this will use the WHOIS server in "internal-whois.com" to get the data about `intranet-service.corporation`.
```
