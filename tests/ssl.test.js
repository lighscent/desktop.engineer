import 'reflect-metadata'
import { describe, it, expect } from 'vitest'
import { derToPem, randomPassword, isIp, encryptPkcs8 } from '@/utils/ssl.js'

describe('ssl utils', () => {
  it('derToPem formats DER as PEM with 64-char lines', () => {
    const der = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x05])
    const pem = derToPem(der, 'TEST LABEL')
    expect(pem.startsWith('-----BEGIN TEST LABEL-----\n')).toBe(true)
    expect(pem.endsWith('\n-----END TEST LABEL-----')).toBe(true)
    const body = pem.split('\n').slice(1, -1)
    for (const line of body) expect(line.length).toBeLessThanOrEqual(64)
  })

  it('randomPassword respects length and charset', () => {
    const pwd = randomPassword(32)
    expect(pwd).toHaveLength(32)
    expect(pwd).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*-_=+]+$/)
    expect(randomPassword(20)).not.toBe(randomPassword(20))
  })

  it('isIp detects IPv4 and IPv6-ish values', () => {
    expect(isIp('192.168.1.1')).toBe(true)
    expect(isIp('::1')).toBe(true)
    expect(isIp('example.com')).toBe(false)
    expect(isIp('host.local')).toBe(false)
  })

  it('encryptPkcs8 produces a DER SEQUENCE with random salt/iv', async () => {
    const input = new TextEncoder().encode('fake-private-key-material')
    const a = await encryptPkcs8(input, 'correct-horse', 10000)
    const b = await encryptPkcs8(input, 'correct-horse', 10000)
    expect(a).toBeInstanceOf(Uint8Array)
    expect(a[0]).toBe(0x30)
    expect(a.length).toBeGreaterThan(input.length)
    expect(Buffer.from(a).equals(Buffer.from(b))).toBe(false)
  })
})
