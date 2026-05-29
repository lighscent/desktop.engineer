<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const preset = ref('hourly')
const customMinute = ref('0')
const customHour = ref('*')
const customDay = ref('*')
const customMonth = ref('*')
const customWeekday = ref('*')

const presets = {
  hourly: { label: t('tools.cronGenerator.presetHourly'), expr: '0 * * * *', desc: t('tools.cronGenerator.presetHourlyDesc') },
  daily: { label: t('tools.cronGenerator.presetDaily'), expr: '0 0 * * *', desc: t('tools.cronGenerator.presetDailyDesc') },
  weekly: { label: t('tools.cronGenerator.presetWeekly'), expr: '0 4 * * 1', desc: t('tools.cronGenerator.presetWeeklyDesc') },
  monthly: { label: t('tools.cronGenerator.presetMonthly'), expr: '0 2 1 * *', desc: t('tools.cronGenerator.presetMonthlyDesc') },
  weekday: { label: t('tools.cronGenerator.presetWeekdays'), expr: '0 8 * * 1-5', desc: t('tools.cronGenerator.presetWeekdaysDesc') },
  reboot: { label: t('tools.cronGenerator.presetReboot'), expr: '@reboot', desc: t('tools.cronGenerator.presetRebootDesc') },
  custom: { label: t('tools.cronGenerator.presetCustom'), expr: '', desc: t('tools.cronGenerator.presetCustomDesc') },
}

const expression = computed(() => {
  if (preset.value !== 'custom') return presets[preset.value].expr
  return `${customMinute.value} ${customHour.value} ${customDay.value} ${customMonth.value} ${customWeekday.value}`
})

function copy() {
  navigator.clipboard.writeText(expression.value)
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-mono font-bold mb-2"><i class="fas fa-clock mr-2"></i>{{ t('tools.cronGenerator.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.cronGenerator.desc') }}</p>

    <div class="card bg-base-200 border border-base-300 p-6 mb-6">
      <div class="form-control mb-6">
        <label class="label"><span class="label-text">{{ t('tools.cronGenerator.presets') }}</span></label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(p, key) in presets"
            :key="key"
            class="btn btn-sm"
            :class="preset === key ? 'btn-primary' : 'btn-outline'"
            @click="preset = key"
          >{{ p.label }}</button>
        </div>
      </div>

      <div v-if="preset === 'custom'" class="grid gap-3 md:grid-cols-5">
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.cronGenerator.minute') }}</span></label>
          <input v-model="customMinute" class="input input-bordered font-mono text-center" placeholder="0" />
          <span class="text-xs text-base-content/60 mt-1">{{ t('tools.cronGenerator.minuteRange') }}</span>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.cronGenerator.hour') }}</span></label>
          <input v-model="customHour" class="input input-bordered font-mono text-center" placeholder="*" />
          <span class="text-xs text-base-content/60 mt-1">{{ t('tools.cronGenerator.hourRange') }}</span>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.cronGenerator.dayOfMonth') }}</span></label>
          <input v-model="customDay" class="input input-bordered font-mono text-center" placeholder="*" />
          <span class="text-xs text-base-content/60 mt-1">{{ t('tools.cronGenerator.dayRange') }}</span>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.cronGenerator.month') }}</span></label>
          <input v-model="customMonth" class="input input-bordered font-mono text-center" placeholder="*" />
          <span class="text-xs text-base-content/60 mt-1">{{ t('tools.cronGenerator.monthRange') }}</span>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.cronGenerator.dayOfWeek') }}</span></label>
          <input v-model="customWeekday" class="input input-bordered font-mono text-center" placeholder="*" />
          <span class="text-xs text-base-content/60 mt-1">{{ t('tools.cronGenerator.weekRange') }}</span>
        </div>
      </div>
    </div>

    <div class="card bg-base-200 border border-base-300 p-6">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h2 class="text-xl font-mono font-bold">{{ t('tools.cronGenerator.expression') }}</h2>
          <p v-if="preset !== 'custom'" class="text-sm text-base-content/70">{{ presets[preset].desc }}</p>
        </div>
        <button class="btn btn-outline btn-sm" @click="copy"><i class="fas fa-copy mr-1"></i>{{ t('tools.cronGenerator.copy') }}</button>
      </div>
      <div class="mockup-code p-4">
        <code class="text-lg font-mono">{{ expression }}</code>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-mono font-bold mb-3">{{ t('tools.cronGenerator.syntax') }}</h2>
      <div class="overflow-x-auto">
        <table class="table table-zebra text-sm">
          <thead><tr><th></th><th>{{ t('tools.cronGenerator.minute') }}</th><th>{{ t('tools.cronGenerator.hour') }}</th><th>{{ t('tools.cronGenerator.dayOfMonth') }}</th><th>{{ t('tools.cronGenerator.month') }}</th><th>{{ t('tools.cronGenerator.dayOfWeek') }}</th></tr></thead>
          <tbody>
            <tr><td>{{ t('tools.cronGenerator.values') }}</td><td>0-59</td><td>0-23</td><td>1-31</td><td>1-12</td><td>0-7</td></tr>
            <tr><td>{{ t('tools.cronGenerator.chars') }}</td><td colspan="5"><code>{{ t('tools.cronGenerator.charsDesc') }}</code></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
