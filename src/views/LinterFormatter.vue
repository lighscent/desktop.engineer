<script setup>
import { ref, watch } from 'vue'
import yaml from 'js-yaml'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const mode = ref('json')
const input = ref('{\n  "name": "exemple",\n  "version": "1.0"\n}')
const output = ref('')
const error = ref('')
const errorLine = ref(null)

function process() {
  error.value = ''
  errorLine.value = null
  if (!input.value.trim()) { output.value = ''; return }

  try {
    let data
    if (mode.value === 'json') {
      try {
        data = JSON.parse(input.value)
      } catch (e) {
        const match = e.message.match(/position\s+(\d+)/)
        if (match) {
          const pos = parseInt(match[1])
          const lines = input.value.substring(0, pos).split('\n')
          errorLine.value = lines.length
        }
        throw e
      }
      output.value = JSON.stringify(data, null, 2)
    } else {
      try {
        data = yaml.load(input.value)
      } catch (e) {
        const match = e.message.match(/line (\d+)/)
        if (match) errorLine.value = parseInt(match[1])
        throw e
      }
      output.value = yaml.dump(data, { indent: 2, lineWidth: -1 })
    }
  } catch (e) {
    error.value = t('tools.linterFormatter.syntaxError', { message: e.message })
    output.value = ''
  }
}

function copy() {
  navigator.clipboard.writeText(output.value)
}

watch([mode, input], process, { immediate: true })
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-check-double mr-2"></i>{{ t('tools.linterFormatter.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.linterFormatter.desc') }}</p>

    <div class="flex gap-2 mb-6">
      <button class="btn" :class="mode === 'json' ? 'btn-primary' : 'btn-outline'" @click="mode = 'json'">{{ t('tools.linterFormatter.json') }}</button>
      <button class="btn" :class="mode === 'yaml' ? 'btn-primary' : 'btn-outline'" @click="mode = 'yaml'">{{ t('tools.linterFormatter.yaml') }}</button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 mb-4">
      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('tools.linterFormatter.input') }}</span></label>
        <textarea v-model="input" class="textarea textarea-bordered font-mono text-sm min-h-40" :placeholder="mode === 'json' ? t('tools.linterFormatter.jsonPlaceholder') : t('tools.linterFormatter.yamlPlaceholder')"></textarea>
      </div>
      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('tools.linterFormatter.output') }}</span></label>
        <textarea :value="output" class="textarea textarea-bordered font-mono text-sm min-h-40" readonly :class="{ 'textarea-error': error }"></textarea>
      </div>
    </div>

    <div v-if="error" class="alert alert-error mb-4">
      <i class="fas fa-exclamation-triangle mr-2"></i>
      <span>{{ error }}</span>
      <span v-if="errorLine" class="ml-2 font-mono font-bold">{{ t('tools.linterFormatter.lineError', { line: errorLine }) }}</span>
    </div>

    <div v-if="!error && output" class="flex gap-2">
      <button class="btn btn-outline btn-sm" @click="copy"><i class="fas fa-copy mr-1"></i>{{ t('tools.linterFormatter.copy') }}</button>
      <span class="text-sm text-base-content/60 self-center">{{ t('tools.linterFormatter.validSyntax') }}</span>
    </div>
  </div>
</template>
