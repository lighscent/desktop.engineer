import { describe, it, expect } from 'vitest'
import SparkMD5 from 'spark-md5'
import { sha256 } from 'hash.js'
import { load, dump } from 'js-yaml'

describe('hash vectors (hashWorker deps)', () => {
  it('md5 of empty ArrayBuffer matches known vector', () => {
    const h = new SparkMD5.ArrayBuffer()
    h.append(new ArrayBuffer(0))
    expect(h.end()).toBe('d41d8cd98f00b204e9800998ecf8427e')
  })

  it('sha256 of "abc" matches known vector', () => {
    expect(sha256().update('abc').digest('hex')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })
})

describe('yaml safe defaults', () => {
  it('round-trips plain objects', () => {
    const obj = { a: 1, b: ['x', 'y'] }
    expect(load(dump(obj))).toEqual(obj)
  })

  it('does not execute !!js/function tags with default load', () => {
    expect(() => load('fn: !!js/function "function(){}"')).toThrow()
  })
})
