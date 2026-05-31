<script setup>
import { ref, watch } from 'vue'
import yaml from 'js-yaml'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const inputFormat = ref('json')
const outputFormat = ref('yaml')
const input = ref('{"name": "exemple", "version": "1.0", "dependencies": ["vue", "vite"]}')
const output = ref('')
const error = ref('')

function convert() {
  error.value = ''
  output.value = ''
  if (!input.value.trim()) return

  try {
    let data
    if (inputFormat.value === 'json') {
      data = JSON.parse(input.value)
    } else if (inputFormat.value === 'yaml') {
      data = yaml.load(input.value)
    } else if (inputFormat.value === 'csv') {
      data = parseCSV(input.value)
    }

    if (outputFormat.value === 'json') {
      output.value = JSON.stringify(data, null, 2)
    } else if (outputFormat.value === 'yaml') {
      output.value = yaml.dump(data, { indent: 2, lineWidth: -1 })
    } else if (outputFormat.value === 'csv') {
      output.value = toCSV(data)
    }
  } catch (e) {
    error.value = t('tools.formatConverter.error', { message: e.message })
  }
}

function parseCSV(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length === 0) return []
  const headers = parseCSVLine(lines[0])
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const flat = {}
    headers.forEach((h, i) => { flat[h] = values[i] || '' })
    return unflatten(flat)
  })
  return rows.length === 1 ? rows[0] : rows
}

function parseCSVLine(line) {
  const values = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  values.push(current.trim())
  return values
}

function flatten(obj, prefix = '') {
  let result = {}
  for (const key of Object.keys(obj)) {
    const prefixed = prefix ? `${prefix}.${key}` : key
    const val = obj[key]
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flatten(val, prefixed))
    } else if (Array.isArray(val)) {
      const hasObjects = val.some(v => v !== null && typeof v === 'object')
      if (hasObjects) {
        val.forEach((item, i) => {
          Object.assign(result, flatten(item, `${prefixed}.${i}`))
        })
      } else {
        result[prefixed] = val.join('; ')
      }
    } else {
      result[prefixed] = val
    }
  }
  return result
}

function toArrays(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(toArrays)
  const keys = Object.keys(obj)
  if (keys.length > 0 && keys.every(k => /^\d+$/.test(k))) {
    const arr = []
    for (const k of keys) arr[parseInt(k)] = toArrays(obj[k])
    return arr
  }
  const result = {}
  for (const key of keys) result[key] = toArrays(obj[key])
  return result
}

function unflatten(flat) {
  const obj = {}
  const keys = Object.keys(flat).sort()
  for (const key of keys) {
    const parts = key.split('.')
    let cur = obj
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      const isNextNumeric = /^\d+$/.test(parts[i + 1])
      if (!cur[part] || typeof cur[part] !== 'object') cur[part] = isNextNumeric ? [] : {}
      cur = cur[part]
    }
    cur[parts[parts.length - 1]] = flat[key]
  }
  return toArrays(obj)
}

function escapeCSV(val) {
  if (val === null || val === undefined) return ''
  const s = String(val)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function toCSV(data) {
  if (!Array.isArray(data)) data = [data]
  if (data.length === 0) return ''
  const flatRows = data.map(row => flatten(row))
  const headers = [...new Set(flatRows.flatMap(r => Object.keys(r)))]
  const lines = flatRows.map(row => headers.map(h => escapeCSV(row[h] ?? '')).join(','))
  return [headers.join(','), ...lines].join('\n')
}

function copy() {
  navigator.clipboard.writeText(output.value)
}

watch([inputFormat, outputFormat, input], convert, { immediate: true })

const formats = ['json', 'yaml', 'csv']
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-exchange-alt mr-2"></i>{{ t('tools.formatConverter.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.formatConverter.desc') }}</p>

    <div class="grid gap-4 md:grid-cols-2 mb-6">
      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('tools.formatConverter.inputFormat') }}</span></label>
        <div class="flex gap-2">
          <button v-for="f in formats" :key="f" class="btn btn-sm flex-1" :class="inputFormat === f ? 'btn-primary' : 'btn-outline'" @click="inputFormat = f">{{ f.toUpperCase() }}</button>
        </div>
      </div>
      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('tools.formatConverter.outputFormat') }}</span></label>
        <div class="flex gap-2">
          <button v-for="f in formats" :key="f" class="btn btn-sm flex-1" :class="outputFormat === f ? 'btn-primary' : 'btn-outline'" @click="outputFormat = f">{{ f.toUpperCase() }}</button>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 mb-4">
      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('tools.formatConverter.input') }}</span></label>
        <textarea v-model="input" class="textarea textarea-bordered font-mono text-sm min-h-40" :placeholder="t('tools.formatConverter.inputPlaceholder', { format: inputFormat.toUpperCase() })"></textarea>
      </div>
      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('tools.formatConverter.output') }}</span></label>
        <textarea :value="output" class="textarea textarea-bordered font-mono text-sm min-h-40" readonly></textarea>
      </div>
    </div>

    <div v-if="error" class="alert alert-error mb-4">{{ error }}</div>

    <button v-if="output" class="btn btn-outline btn-sm" @click="copy"><i class="fas fa-copy mr-1"></i>{{ t('tools.formatConverter.copyResult') }}</button>
  </div>
</template>
