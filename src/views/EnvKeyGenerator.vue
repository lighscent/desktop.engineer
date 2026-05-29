<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const length = ref(64)
const format = ref('base64')
const prefix = ref('APP_KEY')
const includeExport = ref(true)
const generated = ref('')

function generate() {
  const byteLen = format.value === 'base64' ? Math.ceil(length.value * 3 / 4) : Math.ceil(length.value / 2)
  const raw = new Uint8Array(byteLen)
  crypto.getRandomValues(raw)

  let key
  if (format.value === 'base64') {
    key = btoa(String.fromCharCode(...raw)).substring(0, length.value)
  } else {
    key = Array.from(raw, b => b.toString(16).padStart(2, '0')).join('').substring(0, length.value)
  }

  const p = prefix.value.trim() || 'APP_KEY'
  generated.value = includeExport.value ? `${p}=${key}` : key
}

function copy() {
  navigator.clipboard.writeText(generated.value)
}

generate()
</script>

<template>
  <div>
    <h1 class="text-3xl font-mono font-bold mb-2"><i class="fas fa-file-code mr-2"></i>{{ t('tools.envKeyGenerator.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.envKeyGenerator.desc') }}</p>

    <div class="card bg-base-200 border border-base-300 p-6 mb-6">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.envKeyGenerator.length') }}</span></label>
          <div class="flex gap-2 items-center">
            <input v-model.number="length" type="range" min="16" max="256" class="range range-sm flex-1" @input="generate" />
            <span class="font-mono text-sm w-12 text-right">{{ length }}</span>
          </div>
          <div class="relative w-full h-5 mt-0.5">
            <span
              class="absolute text-xs text-base-content/40 font-mono cursor-pointer hover:text-base-content/70 transition-colors"
              style="left: calc((32 - 16) / (256 - 16) * 100%); transform: translateX(-50%)"
              @click="length = 32; generate()"
            >32</span>
            <span
              class="absolute text-xs text-base-content/40 font-mono cursor-pointer hover:text-base-content/70 transition-colors"
              style="left: calc((64 - 16) / (256 - 16) * 100%); transform: translateX(-50%)"
              @click="length = 64; generate()"
            >64</span>
            <span
              class="absolute text-xs text-base-content/40 font-mono cursor-pointer hover:text-base-content/70 transition-colors"
              style="left: calc((128 - 16) / (256 - 16) * 100%); transform: translateX(-50%)"
              @click="length = 128; generate()"
            >128</span>
          </div>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.envKeyGenerator.format') }}</span></label>
          <select v-model="format" class="select select-bordered font-mono text-sm">
            <option value="base64">{{ t('tools.envKeyGenerator.base64') }}</option>
            <option value="hex">{{ t('tools.envKeyGenerator.hex') }}</option>
          </select>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.envKeyGenerator.prefix') }}</span></label>
          <input v-model="prefix" class="input input-bordered font-mono text-sm" :placeholder="t('tools.envKeyGenerator.prefixPlaceholder')" />
        </div>
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="includeExport" type="checkbox" class="checkbox checkbox-sm" />
            <span class="label-text">{{ t('tools.envKeyGenerator.includePrefix') }} (<code>KEY=...</code>)</span>
          </label>
        </div>
      </div>
    </div>

    <button class="btn btn-success mb-4" @click="generate"><i class="fas fa-rotate mr-1"></i>{{ t('tools.envKeyGenerator.generate') }}</button>

    <div v-if="generated" class="mb-4">
      <div class="flex items-center gap-3">
        <code class="flex-1 p-4 bg-base-300 rounded-box break-all font-mono text-sm">{{ generated }}</code>
        <button class="btn btn-outline btn-sm" @click="copy"><i class="fas fa-copy"></i></button>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-mono font-bold mb-3">{{ t('tools.envKeyGenerator.examples') }}</h2>
      <div class="overflow-x-auto">
        <table class="table table-zebra text-sm">
          <thead><tr><th>{{ t('tools.envKeyGenerator.usage') }}</th><th>{{ t('tools.envKeyGenerator.variable') }}</th><th>{{ t('tools.envKeyGenerator.recommended') }}</th></tr></thead>
          <tbody>
            <tr><td>{{ t('tools.envKeyGenerator.exampleLaravel') }}</td><td><code>APP_KEY</code></td><td>{{ t('tools.envKeyGenerator.size32base64') }}</td></tr>
            <tr><td>{{ t('tools.envKeyGenerator.exampleJwt') }}</td><td><code>JWT_SECRET</code></td><td>{{ t('tools.envKeyGenerator.size64base64') }}</td></tr>
            <tr><td>{{ t('tools.envKeyGenerator.exampleSession') }}</td><td><code>SESSION_SECRET</code></td><td>{{ t('tools.envKeyGenerator.size64hex') }}</td></tr>
            <tr><td>{{ t('tools.envKeyGenerator.exampleHashids') }}</td><td><code>HASHID_SALT</code></td><td>{{ t('tools.envKeyGenerator.size32hex') }}</td></tr>
            <tr><td>{{ t('tools.envKeyGenerator.exampleWebhook') }}</td><td><code>WEBHOOK_SECRET</code></td><td>{{ t('tools.envKeyGenerator.size64base64') }}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
