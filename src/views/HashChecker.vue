<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useI18n } from '@/i18n'
import SparkMD5 from 'spark-md5'
import HashWorker from '@/workers/hashWorker?worker'

const { t } = useI18n()

const MB = 1024 * 1024
const CHUNK = 1 * MB

const input = ref('')
const results = ref(null)
const mode = ref('text')
const fileName = ref('')
const loading = ref(false)
const loaded = ref(0)
const total = ref(0)

let worker = null

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' ' + t('tools.hashChecker.bytes')
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' ' + t('tools.hashChecker.kb')
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' ' + t('tools.hashChecker.mb')
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' ' + t('tools.hashChecker.gb')
}

onBeforeUnmount(() => {
  if (worker) worker.terminate()
})

async function computeText() {
  const text = input.value
  if (!text) { results.value = null; return }

  const data = new TextEncoder().encode(text)

  const [digest1, digest256, digest512] = await Promise.all([
    crypto.subtle.digest('SHA-1', data),
    crypto.subtle.digest('SHA-256', data),
    crypto.subtle.digest('SHA-512', data),
  ])

  results.value = {
    md5: SparkMD5.ArrayBuffer.hash(data.buffer),
    sha1: hex(digest1),
    sha256: hex(digest256),
    sha512: hex(digest512),
  }
}

function hex(buf) {
  return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('')
}

function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return
  mode.value = 'file'
  fileName.value = file.name
  results.value = null
  loading.value = true
  loaded.value = 0
  total.value = file.size

  if (file.size <= 50 * MB) {
    const reader = new FileReader()
    reader.onload = async () => {
      const data = new Uint8Array(reader.result)
      loaded.value = total.value
      const algorithms = ['SHA-1', 'SHA-256', 'SHA-512']
      const digests = await Promise.all(
        algorithms.map(algo => crypto.subtle.digest(algo, data))
      )
      results.value = {
        md5: SparkMD5.ArrayBuffer.hash(data.buffer),
        sha1: hex(digests[0]),
        sha256: hex(digests[1]),
        sha512: hex(digests[2]),
      }
      loading.value = false
    }
    reader.readAsArrayBuffer(file)
    return
  }

  computeLargeStream(file)
}

async function computeLargeStream(file) {
  worker = new HashWorker()
  worker.postMessage({ type: 'start', total: file.size })

  worker.onmessage = (e) => {
    const msg = e.data
    if (msg.type === 'progress') {
      loaded.value = msg.loaded
    } else if (msg.type === 'done') {
      results.value = { md5: msg.md5, sha1: msg.sha1, sha256: msg.sha256, sha512: msg.sha512 }
      loading.value = false
      worker.terminate()
      worker = null
    }
  }

  let offset = 0
  while (offset < file.size) {
    const slice = file.slice(offset, offset + CHUNK)
    const buf = await readBlob(slice)
    const len = buf.byteLength
    worker.postMessage({ type: 'chunk', data: buf }, [buf])
    offset += len
  }

  worker.postMessage({ type: 'finish' })
}

function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(blob)
  })
}

function copy(text) {
  navigator.clipboard.writeText(text)
}

const hashes = [
  { key: 'md5', label: 'MD5', bits: 128 },
  { key: 'sha1', label: 'SHA-1', bits: 160 },
  { key: 'sha256', label: 'SHA-256', bits: 256 },
  { key: 'sha512', label: 'SHA-512', bits: 512 },
]
</script>

<template>
  <div>
    <h1 class="text-3xl font-mono font-bold mb-2"><i class="fas fa-fingerprint mr-2"></i>{{ t('tools.hashChecker.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.hashChecker.desc') }}</p>

    <div class="card bg-base-200 border border-base-300 p-6 mb-6">
      <div class="flex gap-4 mb-4">
        <button class="btn" :class="mode === 'text' ? 'btn-primary' : 'btn-outline'" @click="mode = 'text'"><i class="fas fa-font mr-1"></i>{{ t('tools.hashChecker.text') }}</button>
        <button class="btn" :class="mode === 'file' ? 'btn-primary' : 'btn-outline'" @click="mode = 'file'"><i class="fas fa-file mr-1"></i>{{ t('tools.hashChecker.file') }}</button>
      </div>

      <div v-if="mode === 'text'">
        <textarea
          v-model="input"
          class="textarea textarea-bordered font-mono text-sm min-h-28 w-full"
          :placeholder="t('tools.hashChecker.textPlaceholder')"
          @input="computeText"
        ></textarea>
      </div>
      <div v-else>
        <input type="file" class="file-input file-input-bordered w-full" @change="handleFile" />
        <p v-if="fileName" class="text-xs text-base-content/50 mt-2"><i class="fas fa-file mr-1"></i>{{ fileName }}</p>
      </div>
    </div>

    <div v-if="loading" class="card bg-base-200 border border-base-300 p-6 mb-6">
      <div class="flex items-center gap-4">
        <span class="loading loading-spinner loading-md text-primary"></span>
        <div class="flex-1">
          <p class="text-sm font-mono">{{ t('tools.hashChecker.processing') }}</p>
          <progress class="progress progress-primary w-full mt-2" :value="loaded" :max="total"></progress>
          <p class="text-xs text-base-content/50 mt-1">{{ formatSize(loaded) }} / {{ formatSize(total) }} ({{ Math.round(100 * loaded / total) }}%)</p>
        </div>
      </div>
    </div>

    <div v-if="results" class="grid gap-3">
      <div v-for="h in hashes" :key="h.key" class="card bg-base-200 border border-base-300 p-4">
        <div class="flex items-center justify-between mb-1">
          <span class="font-mono text-sm font-bold">{{ t('tools.hashChecker.' + h.key) }} ({{ h.bits }} {{ t('tools.hashChecker.bits') }})</span>
          <button class="btn btn-ghost btn-xs" @click="copy(results[h.key])"><i class="fas fa-copy"></i></button>
        </div>
        <code class="text-xs break-all font-mono">{{ results[h.key] }}</code>
      </div>
    </div>
  </div>
</template>
