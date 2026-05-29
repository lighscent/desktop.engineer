<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const mode = ref('encode')
const type = ref('url')
const input = ref('')
const output = ref('')
const error = ref('')

function process() {
  const val = input.value
  if (!val) { output.value = ''; error.value = ''; return }
  error.value = ''
  try {
    if (mode.value === 'encode') {
      switch (type.value) {
        case 'url': output.value = encodeURIComponent(val); break
        case 'base64': output.value = btoa(val); break
        case 'html': output.value = val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); break
        case 'hex': output.value = Array.from(new TextEncoder().encode(val), b => b.toString(16).padStart(2, '0')).join(' '); break
      }
    } else {
      switch (type.value) {
        case 'url': output.value = decodeURIComponent(val); break
        case 'base64': output.value = atob(val); break
        case 'html': {
          const el = document.createElement('textarea')
          el.innerHTML = val
          output.value = el.value
          break
        }
        case 'hex': output.value = new TextDecoder().decode(new Uint8Array(val.trim().split(/\s+/).map(h => parseInt(h, 16)))); break
      }
    }
  } catch (e) {
    error.value = t('tools.swissKnifeEncoder.error', { message: e.message })
    output.value = ''
  }
}

function swap() {
  input.value = output.value
  output.value = ''
}

function copy() {
  navigator.clipboard.writeText(output.value)
}
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-tools mr-2"></i>{{ t('tools.swissKnifeEncoder.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.swissKnifeEncoder.desc') }}</p>

    <div class="card bg-base-200 border border-base-300 p-4 sm:p-6 mb-6 w-full min-w-0">
      <div class="grid gap-4 md:grid-cols-3 mb-6">
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.swissKnifeEncoder.mode') }}</span></label>
          <select v-model="mode" class="select select-bordered font-mono text-sm" @change="process">
            <option value="encode">{{ t('tools.swissKnifeEncoder.encode') }}</option>
            <option value="decode">{{ t('tools.swissKnifeEncoder.decode') }}</option>
          </select>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.swissKnifeEncoder.type') }}</span></label>
          <select v-model="type" class="select select-bordered font-mono text-sm" @change="process">
            <option value="url">{{ t('tools.swissKnifeEncoder.url') }}</option>
            <option value="base64">{{ t('tools.swissKnifeEncoder.base64') }}</option>
            <option value="html">{{ t('tools.swissKnifeEncoder.htmlEntities') }}</option>
            <option value="hex">{{ t('tools.swissKnifeEncoder.hex') }}</option>
          </select>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.swissKnifeEncoder.input') }}</span></label>
          <textarea v-model="input" class="textarea textarea-bordered font-mono text-sm min-h-28" @input="process"></textarea>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.swissKnifeEncoder.output') }}</span></label>
          <textarea :value="output" class="textarea textarea-bordered font-mono text-sm min-h-28" readonly></textarea>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-error mb-4">{{ error }}</div>

    <div class="flex gap-3">
      <button class="btn btn-outline" @click="swap"><i class="fas fa-arrow-right-arrow-left mr-1"></i>{{ t('tools.swissKnifeEncoder.swap') }}</button>
      <button v-if="output && !error" class="btn btn-outline" @click="copy"><i class="fas fa-copy mr-1"></i>{{ t('tools.swissKnifeEncoder.copy') }}</button>
    </div>
  </div>
</template>
