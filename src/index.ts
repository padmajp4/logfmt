type LogValue = string | number | boolean | null | undefined

export type LogObject = Record<string, LogValue>

function serializeValue(value: LogValue): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  // quote strings that contain spaces, =, or "
  if (/[\s=""]/.test(value)) return `"${value.replace(/"/g, '\\"')}"`
  return value
}

export function logfmt(obj: LogObject): string {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      if (/[\s="]/.test(k)) throw new Error(`logfmt: invalid key "${k}" — keys must not contain spaces, = or "`)
      const serialized = serializeValue(v)
      return serialized === '' ? k : `${k}=${serialized}`
    })
    .join(' ')
}

export function parseLogfmt(line: string): LogObject {
  if (line.length > 10_000) throw new RangeError('parseLogfmt: input exceeds 10,000 characters')
  const result: LogObject = {}
  const re = /(\w+)=("(?:[^"\\]|\\.)*"|[^\s]*)/g

  for (const match of line.matchAll(re)) {
    const key = match[1]
    let value: string = match[2]
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1).replace(/\\"/g, '"')
    }
    result[key] = value
  }

  return result
}
