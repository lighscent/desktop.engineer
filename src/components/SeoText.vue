<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n'

const props = defineProps({
  ns: { type: String, required: true },
})

const { t } = useI18n()

const heading = computed(() => t(`seo.${props.ns}.h2`))
const intro = computed(() => t(`seo.${props.ns}.intro`))
const outro = computed(() => t(`seo.${props.ns}.outro`))
const points = computed(() => {
  const count = parseInt(t(`seo.${props.ns}.pointsCount`), 10) || 0
  return Array.from({ length: count }, (_, i) => t(`seo.${props.ns}.p${i + 1}`))
})
</script>

<template>
  <section class="mt-12 pt-8 border-t border-base-300">
    <h2 class="text-xl md:text-2xl font-mono font-bold mb-3">{{ heading }}</h2>
    <p class="text-sm leading-relaxed text-base-content/70 mb-4">{{ intro }}</p>
    <ul class="list-disc list-inside space-y-2 text-sm leading-relaxed text-base-content/70 mb-4">
      <li v-for="(p, i) in points" :key="i">{{ p }}</li>
    </ul>
    <p class="text-sm leading-relaxed text-base-content/70">{{ outro }}</p>
  </section>
</template>