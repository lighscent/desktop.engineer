<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'
import { generateSelfSignedCert, encryptPkcs8, derToPem, randomPassword } from '@/utils/ssl'

const { t } = useI18n()

const keyType = ref('rsa')
const bits = ref(2048)
const curve = ref('P-256')
const cn = ref('192.0.2.1')
const sans = ref('192.0.2.1, 127.0.0.1, ::1')
const days = ref(365)
const encrypt = ref(true)
const password = ref(randomPassword())
const generating = ref(false)
const result = ref(null)

const sansList = computed(() =>
  sans.value.split(',').map(s => s.trim()).filter(Boolean)
)

function regeneratePassword() {
  password.value = randomPassword()
}

async function generate() {
  generating.value = true
  result.value = null
  try {
    const cert = await generateSelfSignedCert({
      type: keyType.value,
      bits: bits.value,
      curve: curve.value,
      cn: cn.value.trim() || '192.0.2.1',
      sans: sansList.value,
      days: days.value || 365,
    })
    const encryptedPem = encrypt.value
      ? derToPem(await encryptPkcs8(cert.privateKeyDer, password.value), 'ENCRYPTED PRIVATE KEY')
      : null
    const decryptedPem = derToPem(cert.privateKeyDer, 'PRIVATE KEY')
    result.value = { ...cert, encryptedPem, decryptedPem }
  } finally {
    generating.value = false
  }
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

function copy(text) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-certificate mr-2"></i>{{ t('tools.sslCertGenerator.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.sslCertGenerator.desc') }}</p>

    <div class="card bg-base-200 border border-base-300 p-4 sm:p-6 mb-6 w-full min-w-0">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.sslCertGenerator.algorithm') }}</span></label>
          <select v-model="keyType" class="select select-bordered font-mono text-sm">
            <option value="rsa">RSA</option>
            <option value="ecdsa">ECDSA</option>
          </select>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ keyType === 'rsa' ? t('tools.sslCertGenerator.bits') : t('tools.sslCertGenerator.curve') }}</span></label>
          <select v-if="keyType === 'rsa'" v-model.number="bits" class="select select-bordered font-mono text-sm">
            <option :value="2048">2048</option>
            <option :value="4096">4096</option>
          </select>
          <select v-else v-model="curve" class="select select-bordered font-mono text-sm">
            <option value="P-256">P-256</option>
            <option value="P-384">P-384</option>
          </select>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.sslCertGenerator.commonName') }}</span></label>
          <input v-model="cn" class="input input-bordered font-mono text-sm" :placeholder="t('tools.sslCertGenerator.cnPlaceholder')" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.sslCertGenerator.validity') }}</span></label>
          <div class="flex items-center gap-2">
            <input v-model.number="days" type="number" min="1" max="3650" class="input input-bordered font-mono text-sm w-full" />
            <span class="text-sm text-base-content/60 whitespace-nowrap">{{ t('tools.sslCertGenerator.days') }}</span>
          </div>
        </div>
        <div class="form-control md:col-span-2">
          <label class="label"><span class="label-text">{{ t('tools.sslCertGenerator.sans') }}</span></label>
          <textarea v-model="sans" rows="2" class="textarea textarea-bordered font-mono text-sm" :placeholder="t('tools.sslCertGenerator.sansPlaceholder')"></textarea>
          <label class="label"><span class="label-text text-xs text-base-content/50">{{ t('tools.sslCertGenerator.sansHint') }}</span></label>
        </div>
        <div class="md:col-span-2">
          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="encrypt" type="checkbox" class="checkbox checkbox-success checkbox-sm" />
              <span class="label-text">{{ t('tools.sslCertGenerator.encryptKey') }}</span>
            </label>
          </div>
          <div v-if="encrypt" class="flex items-center gap-2 mt-1">
            <input :value="password" readonly class="input input-bordered input-sm font-mono text-sm flex-1 min-w-0" />
            <button class="btn btn-outline btn-sm" @click="regeneratePassword" :title="t('tools.sslCertGenerator.regenerate')">
              <i class="fas fa-dice mr-1"></i>{{ t('tools.sslCertGenerator.regenerate') }}
            </button>
            <button class="btn btn-ghost btn-sm" @click="copy(password)" :title="t('tools.sslCertGenerator.copy')">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-success mb-6" :disabled="generating || sansList.length === 0" @click="generate">
      <i v-if="generating" class="fas fa-spinner fa-spin mr-1"></i>
      <i v-else class="fas fa-certificate mr-1"></i>
      {{ generating ? t('tools.sslCertGenerator.generating') : t('tools.sslCertGenerator.generateBtn') }}
    </button>

    <div v-if="sansList.length === 0" class="alert alert-warning mb-6">
      <i class="fas fa-triangle-exclamation mr-2"></i>
      <span>{{ t('tools.sslCertGenerator.noSans') }}</span>
    </div>

    <div v-if="result" class="space-y-4">
      <div class="alert alert-success mb-4">
        <i class="fas fa-check-circle mr-2"></i>
        <span>{{ t('tools.sslCertGenerator.localOnly') }}</span>
      </div>

      <div class="card bg-base-200 border border-base-300 p-4 w-full min-w-0">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-mono font-bold">{{ t('tools.sslCertGenerator.certificate') }} <code class="badge badge-outline badge-sm">{{ result.algorithm }}</code></h2>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-xs" @click="download(result.certPem, 'certificate.crt')"><i class="fas fa-download mr-1"></i>{{ t('tools.sslCertGenerator.download') }}</button>
            <button class="btn btn-ghost btn-xs" @click="copy(result.certPem)"><i class="fas fa-copy"></i></button>
          </div>
        </div>
        <pre class="text-xs font-mono bg-base-300 p-3 rounded-box overflow-x-auto max-h-40">{{ result.certPem.substring(0, 160) }}...</pre>
      </div>

      <div v-if="result.encryptedPem" class="card bg-base-200 border border-base-300 p-4 w-full min-w-0">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-mono font-bold">{{ t('tools.sslCertGenerator.encryptedKey') }} <code class="badge badge-outline badge-sm">private.key</code></h2>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-xs" @click="download(result.encryptedPem, 'private.key')"><i class="fas fa-download mr-1"></i>{{ t('tools.sslCertGenerator.download') }}</button>
            <button class="btn btn-ghost btn-xs" @click="copy(result.encryptedPem)"><i class="fas fa-copy"></i></button>
          </div>
        </div>
        <pre class="text-xs font-mono bg-base-300 p-3 rounded-box overflow-x-auto max-h-40">{{ result.encryptedPem.substring(0, 160) }}...</pre>
      </div>

      <div class="card bg-base-200 border border-base-300 p-4 w-full min-w-0">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-mono font-bold">{{ t('tools.sslCertGenerator.decryptedKey') }} <code class="badge badge-outline badge-sm">private.decrypted.key</code></h2>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-xs" @click="download(result.decryptedPem, 'private.decrypted.key')"><i class="fas fa-download mr-1"></i>{{ t('tools.sslCertGenerator.download') }}</button>
            <button class="btn btn-ghost btn-xs" @click="copy(result.decryptedPem)"><i class="fas fa-copy"></i></button>
          </div>
        </div>
        <pre class="text-xs font-mono bg-base-300 p-3 rounded-box overflow-x-auto max-h-40">{{ result.decryptedPem.substring(0, 160) }}...</pre>
      </div>

      <div v-if="result.encryptedPem" class="card bg-base-200 border border-base-300 p-4 w-full min-w-0">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-mono font-bold">{{ t('tools.sslCertGenerator.passwordFile') }}</h2>
          <button class="btn btn-ghost btn-xs" @click="copy(password)"><i class="fas fa-copy"></i></button>
        </div>
        <pre class="text-xs font-mono bg-base-300 p-3 rounded-box overflow-x-auto">{{ password }}</pre>
      </div>
    </div>
  </div>
</template>
