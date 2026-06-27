# @padmaj/logfmt

Serialize objects to logfmt `key=value` format and parse them back. Zero dependencies. TypeScript-first. Works in Node and browser.

Compatible with Datadog, Grafana, Heroku, and any log aggregator that speaks logfmt.

## Install

```bash
npm install @padmaj/logfmt
```

## Usage

### Serialize → logfmt string

```ts
import { logfmt } from '@padmaj/logfmt'

logfmt({ level: 'info', msg: 'server started', port: 3000 })
// → 'level=info msg="server started" port=3000'

logfmt({ level: 'error', ok: false, latency: 1.5 })
// → 'level=error ok=false latency=1.5'
```

### Parse logfmt string → object

```ts
import { parseLogfmt } from '@padmaj/logfmt'

parseLogfmt('level=info msg="server started" port=3000')
// → { level: 'info', msg: 'server started', port: '3000' }
```

### Use with console.log

```ts
console.log(logfmt({ level: 'info', msg: 'request received', path: '/api/users', ms: 42 }))
// level=info msg="request received" path=/api/users ms=42
```

## Serialization rules

| Value type | Example input | Output |
|---|---|---|
| Plain string | `'info'` | `level=info` |
| String with spaces | `'server started'` | `msg="server started"` |
| String with `=` | `'a=b'` | `expr="a=b"` |
| Number | `3000` | `port=3000` |
| Boolean | `true` | `ok=true` |
| `null` | `null` | `err` (bare key) |
| `undefined` | `undefined` | *(omitted)* |

## API

### `logfmt(obj: Record<string, string | number | boolean | null | undefined>): string`

Serializes an object to a logfmt string.

### `parseLogfmt(line: string): Record<string, string>`

Parses a logfmt string back into an object. All values are returned as strings.

## Notes

- `logfmt` and `parseLogfmt` are round-trip compatible — parsing a serialized string returns the original values (as strings).
- Keys with `undefined` values are omitted from output.
- Keys with `null` values are rendered as bare keys (no `=value`).
- Keys must not contain spaces, `=`, or `"` — `logfmt` throws if they do.
- `parseLogfmt` rejects inputs longer than 10,000 characters with a `RangeError`.

## License

MIT
