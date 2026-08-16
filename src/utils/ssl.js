import * as x509 from '@peculiar/x509'

const OID_PBES2 = '1.2.840.113549.1.5.13'
const OID_PBKDF2 = '1.2.840.113549.1.5.12'
const OID_HMAC_SHA256 = '1.2.840.113549.2.9'
const OID_AES256_CBC = '2.16.840.1.101.3.4.1.42'

function textEncoder() {
  return new TextEncoder()
}

function derLen(n) {
  if (n < 0x80) return Uint8Array.of(n)
  const bytes = []
  let v = n
  while (v > 0) {
    bytes.unshift(v & 0xff)
    v >>= 8
  }
  return Uint8Array.of(0x80 | bytes.length, ...bytes)
}

function derTag(tag, content) {
  const len = derLen(content.length)
  const out = new Uint8Array(1 + len.length + content.length)
  out[0] = tag
  out.set(len, 1)
  out.set(content, 1 + len.length)
  return out
}

function derSeq(...parts) {
  return derTag(0x30, concat(...parts))
}

function derInt(n) {
  let bytes = []
  let v = n
  while (v > 0) {
    bytes.unshift(v & 0xff)
    v = Math.floor(v / 256)
  }
  if (bytes.length === 0) bytes = [0]
  if (bytes[0] & 0x80) bytes.unshift(0)
  return derTag(0x02, Uint8Array.from(bytes))
}

function derOctets(bytes) {
  return derTag(0x04, new Uint8Array(bytes))
}

function derOid(oid) {
  const parts = oid.split('.').map(Number)
  const body = [parts[0] * 40 + parts[1]]
  for (let i = 2; i < parts.length; i++) {
    let v = parts[i]
    const chunk = [v & 0x7f]
    v >>= 7
    while (v > 0) {
      chunk.unshift((v & 0x7f) | 0x80)
      v >>= 7
    }
    body.push(...chunk)
  }
  return derTag(0x06, Uint8Array.from(body))
}

function derNull() {
  return Uint8Array.of(0x05, 0x00)
}

function derAlg(oid, params) {
  if (params) return derSeq(derOid(oid), params)
  return derSeq(derOid(oid))
}

function concat(...arrays) {
  const total = arrays.reduce((sum, a) => sum + a.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const a of arrays) {
    out.set(a, offset)
    offset += a.length
  }
  return out
}

export function derToPem(der, label) {
  const b64 = btoa(String.fromCharCode(...new Uint8Array(der)))
  const lines = b64.match(/.{1,64}/g) || []
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`
}

export function randomPassword(length = 20) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*-_=+'
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  let out = ''
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length]
  return out
}

function randomSerial() {
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  bytes[0] &= 0x7f
  let hex = ''
  for (const b of bytes) hex += b.toString(16).padStart(2, '0')
  return hex
}

export function isIp(value) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) return true
  return value.includes(':')
}

export async function generateSelfSignedCert({ type, bits, curve, cn, sans, days }) {
  const alg = type === 'rsa'
    ? { name: 'RSASSA-PKCS1-v1_5', modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }
    : { name: 'ECDSA', namedCurve: curve }
  const keys = await crypto.subtle.generateKey(alg, true, ['sign', 'verify'])

  const signingAlgorithm = type === 'rsa'
    ? { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }
    : { name: 'ECDSA', hash: curve === 'P-384' ? 'SHA-384' : 'SHA-256' }

  const sanItems = [...new Set(sans.map(s => s.trim()).filter(Boolean))].map(value => ({
    type: isIp(value) ? 'ip' : 'dns',
    value,
  }))

  const keyUsage = type === 'rsa'
    ? x509.KeyUsageFlags.digitalSignature | x509.KeyUsageFlags.keyEncipherment
    : x509.KeyUsageFlags.digitalSignature

  const cert = await x509.X509CertificateGenerator.createSelfSigned({
    serialNumber: randomSerial(),
    name: `CN=${cn.replace(/([,\\])/g, '\\$1')}`,
    notBefore: new Date(Date.now() - 60 * 1000),
    notAfter: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    signingAlgorithm,
    keys,
    extensions: [
      new x509.BasicConstraintsExtension(true, undefined, true),
      new x509.KeyUsagesExtension(keyUsage, true),
      new x509.ExtendedKeyUsageExtension([x509.ExtendedKeyUsage.serverAuth], false),
      new x509.SubjectAlternativeNameExtension(sanItems, true),
      await x509.SubjectKeyIdentifierExtension.create(keys.publicKey),
    ],
  })

  const privateKeyDer = new Uint8Array(await crypto.subtle.exportKey('pkcs8', keys.privateKey))

  return {
    certPem: cert.toString('pem'),
    privateKeyDer,
    algorithm: type === 'rsa' ? `RSA ${bits}` : `ECDSA ${curve}`,
  }
}

export async function encryptPkcs8(pkcs8Der, password, iterations = 100000) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt']
  )
  const iv = crypto.getRandomValues(new Uint8Array(16))
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, pkcs8Der))

  const pbes2Params = derSeq(
    derAlg(OID_PBKDF2, derSeq(derOctets(salt), derInt(iterations), derAlg(OID_HMAC_SHA256, derNull()))),
    derAlg(OID_AES256_CBC, derOctets(iv))
  )
  const encAlg = derAlg(OID_PBES2, pbes2Params)
  return derSeq(encAlg, derOctets(encrypted))
}
