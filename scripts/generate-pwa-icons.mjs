import { writeFileSync, mkdirSync } from 'fs'
import { deflateSync } from 'zlib'

function createPNG(width, height, r, g, b) {
  const raw = Buffer.alloc(height * (1 + width * 3))
  for (let y = 0; y < height; y++) {
    const off = y * (1 + width * 3)
    raw[off] = 0
    for (let x = 0; x < width; x++) {
      const p = off + 1 + x * 3
      raw[p] = r
      raw[p + 1] = g
      raw[p + 2] = b
    }
  }
  const deflated = deflateSync(raw)

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const chunks = []
  chunks.push(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  chunks.push(writeChunk('IHDR', ihdr))
  chunks.push(writeChunk('IDAT', deflated))
  chunks.push(writeChunk('IEND', Buffer.alloc(0)))

  return Buffer.concat(chunks)
}

function writeChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeB = Buffer.from(type, 'ascii')
  const crcData = Buffer.concat([typeB, data])
  const crc = crc32(crcData)
  const crcB = Buffer.alloc(4)
  crcB.writeUInt32BE(crc, 0)
  return Buffer.concat([len, typeB, data, crcB])
}

function crc32(buf) {
  let crc = -1
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ -1) >>> 0
}

mkdirSync('public', { recursive: true })
writeFileSync('public/pwa-192x192.png', createPNG(192, 192, 29, 35, 42))
writeFileSync('public/pwa-512x512.png', createPNG(512, 512, 29, 35, 42))
writeFileSync('public/pwa-192x192-maskable.png', createPNG(192, 192, 29, 35, 42))
writeFileSync('public/pwa-512x512-maskable.png', createPNG(512, 512, 29, 35, 42))
console.log('PWA icons generated in public/')
