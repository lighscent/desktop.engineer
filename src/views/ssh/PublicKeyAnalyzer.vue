<script setup>
import { ref } from 'vue'
import SparkMD5 from 'spark-md5'
import { useI18n } from '@/i18n'

const rawKey = ref('')
const result = ref(null)

const { t } = useI18n()

function decodeBase64(str) {
  try {
    return new Uint8Array([...atob(str)].map(c => c.charCodeAt(0)))
  } catch {
    return null
  }
}

function readLength(buf, offset) {
  const len = (buf[offset] << 24) | (buf[offset + 1] << 16) | (buf[offset + 2] << 8) | buf[offset + 3]
  return { len, offset: offset + 4 }
}

function readString(buf, offset) {
  const { len, offset: newOff } = readLength(buf, offset)
  const str = String.fromCharCode(...buf.slice(newOff, newOff + len))
  return { str, offset: newOff + len }
}

function readBigIntBytes(buf, offset) {
  const { len, offset: newOff } = readLength(buf, offset)
  return { bytes: buf.slice(newOff, newOff + len), offset: newOff + len }
}

function md5Bytes(data) {
  const hex = SparkMD5.ArrayBuffer.hash(data.buffer)
  const arr = new Uint8Array(16)
  for (let i = 0; i < 16; i++) arr[i] = parseInt(hex.substr(i * 2, 2), 16)
  return arr
}

async function analyze() {
  const key = rawKey.value.trim()
  if (!key) { result.value = null; return }

  const parts = key.split(/\s+/)
  if (parts.length < 2) {
    result.value = { error: t('tools.publicKeyAnalyzer.invalidFormat') }
    return
  }

  const algorithm = parts[0]
  const b64Data = parts[1]
  const comment = parts.slice(2).join(' ') || t('tools.publicKeyAnalyzer.none')

  const raw = decodeBase64(b64Data)
  if (!raw) {
    result.value = { error: t('tools.publicKeyAnalyzer.invalidBase64') }
    return
  }

  let offset = 0
  let algoRead
  try {
    algoRead = readString(raw, offset)
  } catch {
    result.value = { error: t('tools.publicKeyAnalyzer.cannotDecode') }
    return
  }

  if (algoRead.str !== algorithm) {
    result.value = { error: t('tools.publicKeyAnalyzer.headerMismatch', { expected: algoRead.str, actual: algorithm }) }
    return
  }
  offset = algoRead.offset

  let details = {}
  let keySize = 0

  if (algorithm === 'ssh-rsa') {
    const e = readBigIntBytes(raw, offset); offset = e.offset
    const n = readBigIntBytes(raw, offset); offset = n.offset
    keySize = n.bytes.length * 8
    details = { exponent: e.bytes.length + ' octets', modulus: keySize + ' bits' }
  } else if (algorithm === 'ssh-ed25519') {
    const pk = readBigIntBytes(raw, offset); offset = pk.offset
    keySize = 256
    details = { courbe: 'Ed25519', taille: '256 bits' }
  } else if (algorithm === 'ecdsa-sha2-nistp256') { const c = readString(raw, offset); offset = c.offset; const q = readBigIntBytes(raw, offset); offset = q.offset; keySize = 256; details = { courbe: c.str, taille: keySize + ' bits' } }
  else if (algorithm === 'ecdsa-sha2-nistp384') { const c = readString(raw, offset); offset = c.offset; const q = readBigIntBytes(raw, offset); offset = q.offset; keySize = 384; details = { courbe: c.str, taille: keySize + ' bits' } }
  else if (algorithm === 'ecdsa-sha2-nistp521') { const c = readString(raw, offset); offset = c.offset; const q = readBigIntBytes(raw, offset); offset = q.offset; keySize = 521; details = { courbe: c.str, taille: keySize + ' bits' } }
  else if (algorithm.startsWith('ecdsa-sha2-')) { try { const c = readString(raw, offset); offset = c.offset; const q = readBigIntBytes(raw, offset); offset = q.offset; keySize = q.bytes.length * 4; details = { courbe: c.str, taille: keySize + ' bits' } } catch { details = { info: 'Algorithme ECDSA reconnu mais clé non décodable' } } }
  else if (algorithm === 'sk-ssh-ed25519@openssh.com') { const pk = readBigIntBytes(raw, offset); offset = pk.offset; keySize = 256; details = { courbe: 'Ed25519 (security key)', taille: '256 bits' } }
  else if (algorithm === 'ssh-dss') { const p = readBigIntBytes(raw, offset); offset = p.offset; const q = readBigIntBytes(raw, offset); offset = q.offset; const g = readBigIntBytes(raw, offset); offset = g.offset; const pub = readBigIntBytes(raw, offset); offset = pub.offset; keySize = p.bytes.length * 8; details = { 'taille p': p.bytes.length * 8 + ' bits' } }
  else {
    details = { info: `Algorithme "${algorithm}" reconnu mais analyse non implémentée` }
    keySize = 0
  }

  let fingerprints = {}
  try {
    const sha256 = await crypto.subtle.digest('SHA-256', raw)
    const md5Arr = md5Bytes(raw)
    fingerprints = {
      sha256: 'SHA256:' + btoa(String.fromCharCode(...new Uint8Array(sha256).slice(0, 32))),
      md5: 'MD5:' + Array.from(md5Arr, b => b.toString(16).padStart(2, '0')).join(':'),
    }
  } catch {
    fingerprints = { sha256: t('tools.publicKeyAnalyzer.notAvailable'), md5: t('tools.publicKeyAnalyzer.notAvailable') }
  }

  result.value = {
    error: null,
    algorithm,
    keySize,
    comment,
    b64Length: b64Data.length,
    details,
    fingerprints,
  }
}

function copy(text) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-microscope mr-2"></i>{{ t('tools.publicKeyAnalyzer.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.publicKeyAnalyzer.desc') }}</p>

    <div class="form-control mb-6">
      <label class="label"><span class="label-text">{{ t('tools.publicKeyAnalyzer.keyInput') }}</span></label>
      <textarea
        v-model="rawKey"
        class="textarea textarea-bordered font-mono text-sm min-h-28"
        :placeholder="t('tools.publicKeyAnalyzer.keyPlaceholder')"
        @input="analyze"
      ></textarea>
    </div>

    <div v-if="result">
      <div v-if="result.error" class="alert alert-error mb-6">{{ result.error }}</div>
      <div v-else>
        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
            <div class="stat-title">{{ t('tools.publicKeyAnalyzer.algorithm') }}</div>
            <div class="stat-value text-lg font-mono break-all">{{ result.algorithm }}</div>
          </div>
          <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
            <div class="stat-title">{{ t('tools.publicKeyAnalyzer.keySize') }}</div>
            <div class="stat-value text-lg">{{ result.keySize ? result.keySize + ' ' + t('tools.publicKeyAnalyzer.bits') : t('tools.publicKeyAnalyzer.dash') }}</div>
          </div>
          <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
            <div class="stat-title">{{ t('tools.publicKeyAnalyzer.comment') }}</div>
            <div class="stat-value text-lg font-mono break-all">{{ result.comment }}</div>
          </div>
          <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
            <div class="stat-title">{{ t('tools.publicKeyAnalyzer.base64Length') }}</div>
            <div class="stat-value text-lg">{{ result.b64Length }} {{ t('tools.publicKeyAnalyzer.chars') }}</div>
          </div>
        </div>

        <div class="card bg-base-200 border border-base-300 p-4 mb-6 w-full min-w-0">
          <h2 class="text-xl font-mono font-bold mb-3">{{ t('tools.publicKeyAnalyzer.fingerprints') }}</h2>
          <div class="space-y-3">
            <div v-if="result.fingerprints">
              <div class="flex items-center justify-between mb-1">
                <span class="font-mono text-sm">{{ t('tools.publicKeyAnalyzer.sha256') }}</span>
                <button class="btn btn-ghost btn-xs" @click="copy(result.fingerprints.sha256)"><i class="fas fa-copy"></i></button>
              </div>
              <code class="text-sm font-mono break-all">{{ result.fingerprints.sha256 }}</code>
            </div>
            <div v-if="result.fingerprints">
              <div class="flex items-center justify-between mb-1 mt-3">
                <span class="font-mono text-sm">{{ t('tools.publicKeyAnalyzer.md5') }}</span>
                <button class="btn btn-ghost btn-xs" @click="copy(result.fingerprints.md5)"><i class="fas fa-copy"></i></button>
              </div>
              <code class="text-sm font-mono break-all">{{ result.fingerprints.md5 }}</code>
            </div>
          </div>
        </div>

        <div v-if="result.details && Object.keys(result.details).length">
          <h2 class="text-xl font-mono font-bold mb-3">{{ t('tools.publicKeyAnalyzer.details') }}</h2>
          <div class="overflow-x-auto">
            <table class="table table-zebra text-sm">
              <thead><tr><th>{{ t('tools.publicKeyAnalyzer.property') }}</th><th>{{ t('tools.publicKeyAnalyzer.value') }}</th></tr></thead>
              <tbody>
                <tr v-for="(val, key) in result.details" :key="key">
                  <td class="font-mono">{{ key }}</td>
                  <td><code>{{ val }}</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
