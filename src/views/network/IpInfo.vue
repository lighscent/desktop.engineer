<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const ip = ref('')
const result = ref(null)
const loading = ref(false)
const error = ref('')

const fields = [
  { key: 'ipAddress', labelKey: 'tools.ipInfo.ip', icon: 'fa-globe' },
  { key: 'ipVersion', labelKey: 'tools.ipInfo.version', icon: 'fa-code-branch' },
  { key: 'countryName', labelKey: 'tools.ipInfo.country', icon: 'fa-flag' },
  { key: 'continent', labelKey: 'tools.ipInfo.continent', icon: 'fa-earth-europe' },
  { key: 'regionName', labelKey: 'tools.ipInfo.region', icon: 'fa-map-marker-alt' },
  { key: 'cityName', labelKey: 'tools.ipInfo.city', icon: 'fa-city' },
  { key: 'capital', labelKey: 'tools.ipInfo.capital', icon: 'fa-landmark' },
  { key: 'zipCode', labelKey: 'tools.ipInfo.zip', icon: 'fa-mailbox' },
  { key: 'latitude', labelKey: 'tools.ipInfo.lat', icon: 'fa-arrows-up-down' },
  { key: 'longitude', labelKey: 'tools.ipInfo.lon', icon: 'fa-arrows-left-right' },
  { key: 'timeZones', labelKey: 'tools.ipInfo.timezone', icon: 'fa-clock' },
  { key: 'asnOrganization', labelKey: 'tools.ipInfo.org', icon: 'fa-sitemap' },
  { key: 'asn', labelKey: 'tools.ipInfo.asn', icon: 'fa-diagram-project' },
  { key: 'isProxy', labelKey: 'tools.ipInfo.isProxy', icon: 'fa-shield' },
]

function displayVal(val) {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  if (Array.isArray(val)) return val.join(', ')
  return String(val)
}

async function lookup(addr) {
  loading.value = true
  error.value = ''
  result.value = null
  try {
    if (!addr) { error.value = t('tools.ipInfo.enterIp'); loading.value = false; return }
    const res = await fetch(`https://free.freeipapi.com/api/json/${addr}`)
    const data = await res.json()
    if (!data || data.error || !data.ipAddress) {
      error.value = t('tools.ipInfo.error', { message: data?.error || 'Invalid IP' })
    } else {
      result.value = data
    }
  } catch (e) {
    error.value = t('tools.ipInfo.error', { message: e.message })
  } finally {
    loading.value = false
  }
}

function doLookup() {
  lookup(ip.value.trim())
}

</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-globe mr-2"></i>{{ t('tools.ipInfo.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.ipInfo.desc') }}</p>

    <div class="form-control mb-6">
      <div class="flex gap-3">
        <input
          v-model="ip"
          class="input input-bordered font-mono flex-1"
          :placeholder="t('tools.ipInfo.ipPlaceholder')"
          @keyup.enter="doLookup"
        />
        <button class="btn btn-success" :disabled="loading" @click="doLookup">
          <i class="fas fa-search mr-1"></i>
          {{ loading ? t('tools.ipInfo.lookingUp') : t('tools.ipInfo.lookup') }}
        </button>
      </div>
      <p class="text-xs text-base-content/40 mt-1.5">{{ t('tools.ipInfo.rateLimit') }}</p>
    </div>

    <div v-if="error" class="alert alert-error mb-6">{{ error }}</div>

    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-success"></span>
    </div>

    <div v-if="result" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="field in fields"
        :key="field.key"
        class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0"
      >
        <div class="stat-title flex items-center gap-2">
          <i :class="'fas ' + field.icon + ' text-base-content/50'"></i>
          {{ t(field.labelKey) }}
        </div>
        <div class="stat-value text-lg font-mono truncate">{{ displayVal(result[field.key]) }}</div>
      </div>
    </div>
  </div>
</template>
