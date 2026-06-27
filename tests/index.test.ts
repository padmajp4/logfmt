import { describe, it, expect } from 'vitest'
import { logfmt, parseLogfmt } from '../src/index'

describe('logfmt', () => {
  it('serializes simple key=value pairs', () => {
    expect(logfmt({ level: 'info', port: 3000 })).toBe('level=info port=3000')
  })

  it('quotes strings with spaces', () => {
    expect(logfmt({ msg: 'server started' })).toBe('msg="server started"')
  })

  it('quotes strings with equals sign', () => {
    expect(logfmt({ expr: 'a=b' })).toBe('expr="a=b"')
  })

  it('serializes booleans unquoted', () => {
    expect(logfmt({ ok: true, fail: false })).toBe('ok=true fail=false')
  })

  it('serializes numbers unquoted', () => {
    expect(logfmt({ port: 3000, latency: 1.5 })).toBe('port=3000 latency=1.5')
  })

  it('omits undefined values', () => {
    expect(logfmt({ level: 'info', trace: undefined })).toBe('level=info')
  })

  it('renders null as bare key', () => {
    expect(logfmt({ level: 'info', err: null })).toBe('level=info err')
  })

  it('escapes quotes inside string values', () => {
    expect(logfmt({ msg: 'say "hello"' })).toBe('msg="say \\"hello\\""')
  })

  it('returns empty string for empty object', () => {
    expect(logfmt({})).toBe('')
  })
})

describe('parseLogfmt', () => {
  it('parses simple key=value pairs', () => {
    expect(parseLogfmt('level=info port=3000')).toEqual({ level: 'info', port: '3000' })
  })

  it('parses quoted values with spaces', () => {
    expect(parseLogfmt('msg="server started"')).toEqual({ msg: 'server started' })
  })

  it('parses escaped quotes inside values', () => {
    expect(parseLogfmt('msg="say \\"hello\\""')).toEqual({ msg: 'say "hello"' })
  })

  it('round-trips logfmt → parseLogfmt', () => {
    const obj = { level: 'info', msg: 'server started', port: 3000 }
    const line = logfmt(obj)
    const parsed = parseLogfmt(line)
    expect(parsed.level).toBe('info')
    expect(parsed.msg).toBe('server started')
    expect(parsed.port).toBe('3000')
  })
})
