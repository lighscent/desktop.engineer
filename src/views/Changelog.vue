<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n'
import changelog from '@/data/changelog'

const { locale, t } = useI18n()

const entries = computed(() =>
  changelog.map(e => ({
    version: e.version,
    date: e.date,
    title: e.title[locale.value] || e.title.en,
    changes: e.changes[locale.value] || e.changes.en,
  }))
)
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-clock-rotate-left mr-2"></i>{{ t('changelog.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('changelog.desc') }}</p>

    <div v-for="entry in entries" :key="entry.version" class="mb-10">
      <div class="flex items-baseline gap-3 mb-4">
        <span class="badge badge-lg badge-success font-mono font-bold">v{{ entry.version }}</span>
        <span class="text-sm text-base-content/50 font-mono">{{ entry.date }}</span>
        <span class="text-base-content/70 font-semibold">{{ entry.title }}</span>
      </div>
      <ul class="list-disc list-inside space-y-1.5 text-sm text-base-content/80">
        <li v-for="(change, ci) in entry.changes" :key="ci">{{ change }}</li>
      </ul>
    </div>
  </div>
</template>
