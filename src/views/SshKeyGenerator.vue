<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const keyType = ref('ed25519')
const bits = ref(4096)
const comment = ref('user@host')
const generated = ref(false)
const keypair = ref(null)

const { t } = useI18n()

async function generate() {
  generated.value = false
  keypair.value = null

  if (keyType.value === 'rsa') {
    const pair = await crypto.subtle.generateKey(
      { name: 'RSA-PSS', modulusLength: bits.value, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['sign', 'verify']
    )
    const pubPem = await exportSPKI(pair.publicKey)
    const privPem = await exportPKCS8(pair.privateKey)
    keypair.value = { pub: pubPem, priv: privPem, type: 'RSA', bits: bits.value }
  } else if (keyType.value === 'ecdsa') {
    const pair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    )
    const pubPem = await exportSPKI(pair.publicKey)
    const privPem = await exportPKCS8(pair.privateKey)
    keypair.value = { pub: pubPem, priv: privPem, type: 'ECDSA', bits: 256 }
  } else {
    generated.value = true
    return
  }
  generated.value = true
}

async function exportSPKI(key) {
  const raw = await crypto.subtle.exportKey('spki', key)
  const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)))
  const lines = b64.match(/.{1,64}/g) || []
  return `-----BEGIN PUBLIC KEY-----\n${lines.join('\n')}\n-----END PUBLIC KEY-----`
}

async function exportPKCS8(key) {
  const raw = await crypto.subtle.exportKey('pkcs8', key)
  const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)))
  const lines = b64.match(/.{1,64}/g) || []
  return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----`
}

function download(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function getFilename() {
  const base = keyType.value === 'rsa' ? 'id_rsa' : keyType.value === 'ecdsa' ? 'id_ecdsa' : 'id_ed25519'
  return base
}

function copy(text) {
  navigator.clipboard.writeText(text)
}

function copyCmd() {
  copy(`ssh-keygen -t ed25519 -C "${comment.value || 'user@host'}" -f ~/.ssh/${getFilename()}`)
}
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-key mr-2"></i>{{ t('tools.sshKeyGenerator.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.sshKeyGenerator.desc') }}</p>

    <div class="card bg-base-200 border border-base-300 p-4 sm:p-6 mb-6 w-full min-w-0">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.sshKeyGenerator.keyType') }}</span></label>
          <select v-model="keyType" class="select select-bordered font-mono text-sm">
            <option value="ed25519">{{ t('tools.sshKeyGenerator.ed25519Label') }}</option>
            <option value="rsa">{{ t('tools.sshKeyGenerator.rsaLabel') }}</option>
            <option value="ecdsa">{{ t('tools.sshKeyGenerator.ecdsaLabel') }}</option>
          </select>
        </div>
        <div v-if="keyType === 'rsa'" class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.sshKeyGenerator.size') }}</span></label>
          <select v-model.number="bits" class="select select-bordered font-mono text-sm">
            <option :value="2048">{{ t('tools.sshKeyGenerator.size2048') }}</option>
            <option :value="4096">{{ t('tools.sshKeyGenerator.size4096') }}</option>
          </select>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.sshKeyGenerator.comment') }}</span></label>
          <input v-model="comment" class="input input-bordered font-mono text-sm" :placeholder="t('tools.sshKeyGenerator.userPlaceholder')" />
        </div>
      </div>
    </div>

    <button class="btn btn-success mb-6" @click="generate">
      <i class="fas fa-key mr-1"></i>{{ keyType === 'ed25519' ? t('tools.sshKeyGenerator.showCmd') : t('tools.sshKeyGenerator.generateBtn') }}
    </button>

    <div v-if="keyType === 'ed25519' && generated" class="mb-6">
      <div class="alert alert-info mb-4">
        <i class="fas fa-info-circle mr-2"></i>
        <span>{{ t('tools.sshKeyGenerator.ed25519NotSupported') }}</span>
      </div>
      <div class="mockup-code p-4 text-sm whitespace-pre-wrap font-mono overflow-x-auto">
ssh-keygen -t ed25519 -C "{{ comment || 'user@host' }}" -f ~/.ssh/{{ getFilename() }}
      </div>
      <button class="btn btn-outline btn-sm mt-2" @click="copyCmd">
        <i class="fas fa-copy mr-1"></i>{{ t('tools.sshKeyGenerator.copyCmd') }}
      </button>
    </div>

    <div v-if="keypair" class="space-y-4">
      <div class="card bg-base-200 border border-base-300 p-4 w-full min-w-0">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-mono font-bold">{{ t('tools.sshKeyGenerator.privateKey') }} <code>{{ getFilename() }}</code></h2>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-xs" @click="download(keypair.priv, getFilename())"><i class="fas fa-download mr-1"></i>{{ t('tools.sshKeyGenerator.download') }}</button>
            <button class="btn btn-ghost btn-xs" @click="copy(keypair.priv)"><i class="fas fa-copy"></i></button>
          </div>
        </div>
        <pre class="text-xs font-mono bg-base-300 p-3 rounded-box overflow-x-auto max-h-40">{{ keypair.priv.substring(0, 200) }}...</pre>
      </div>

      <div class="card bg-base-200 border border-base-300 p-4 w-full min-w-0">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-mono font-bold">{{ t('tools.sshKeyGenerator.publicKey') }} <code>{{ getFilename() }}.pub</code></h2>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-xs" @click="download(keypair.pub, getFilename() + '.pub')"><i class="fas fa-download mr-1"></i>{{ t('tools.sshKeyGenerator.download') }}</button>
            <button class="btn btn-ghost btn-xs" @click="copy(keypair.pub)"><i class="fas fa-copy"></i></button>
          </div>
        </div>
        <pre class="text-xs font-mono bg-base-300 p-3 rounded-box overflow-x-auto max-h-40">{{ keypair.pub }}</pre>
      </div>
    </div>
  </div>
</template>
