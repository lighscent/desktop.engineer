<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'
import cryptoRandomString from 'crypto-random-string'

const { t } = useI18n()

const length = ref(20)
const useUpper = ref(true)
const useLower = ref(true)
const useDigits = ref(true)
const useSpecial = ref(true)
const excludeAmbiguous = ref(false)
const excludeCli = ref(false)
const generated = ref('')

const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lower = 'abcdefghijklmnopqrstuvwxyz'
const digits = '0123456789'
const special = '!@#$%^&*()-_=+[]{}|;:,.<>?/~'
const ambiguous = '0O1lI|!'
const cliConflicts = '&$"\'(\\`;'

const charset = computed(() => {
  let s = ''
  if (useUpper.value) s += upper
  if (useLower.value) s += lower
  if (useDigits.value) s += digits
  if (useSpecial.value) s += special
  if (excludeAmbiguous.value) {
    for (const c of ambiguous) s = s.replaceAll(c, '')
  }
  if (excludeCli.value) {
    for (const c of cliConflicts) s = s.replaceAll(c, '')
  }
  return s
})

function generate() {
  if (!charset.value) {
    generated.value = t('tools.passwordGenerator.selectOne')
    return
  }
  generated.value = cryptoRandomString({ length: length.value, characters: charset.value })
}

function copy() {
  navigator.clipboard.writeText(generated.value)
}

generate()
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-key mr-2"></i>{{ t('tools.passwordGenerator.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.passwordGenerator.desc') }}</p>

    <div class="card bg-base-200 border border-base-300 p-4 sm:p-6 mb-6 w-full min-w-0">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.passwordGenerator.length') }}</span></label>
          <input v-model.number="length" type="range" min="4" max="128" class="range range-sm" />
          <span class="text-sm text-base-content/60 mt-1">{{ length }} {{ t('tools.passwordGenerator.chars') }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="useUpper" type="checkbox" class="checkbox checkbox-sm" />
            <span class="label-text">{{ t('tools.passwordGenerator.uppercase') }}</span>
          </label>
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="useLower" type="checkbox" class="checkbox checkbox-sm" />
            <span class="label-text">{{ t('tools.passwordGenerator.lowercase') }}</span>
          </label>
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="useDigits" type="checkbox" class="checkbox checkbox-sm" />
            <span class="label-text">{{ t('tools.passwordGenerator.digits') }}</span>
          </label>
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="useSpecial" type="checkbox" class="checkbox checkbox-sm" />
            <span class="label-text">{{ t('tools.passwordGenerator.special') }}</span>
          </label>
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="excludeAmbiguous" type="checkbox" class="checkbox checkbox-sm" />
            <span class="label-text">{{ t('tools.passwordGenerator.excludeAmbiguous') }}</span>
          </label>
          <label class="label cursor-pointer justify-start gap-3 font-bold text-warning">
            <input v-model="excludeCli" type="checkbox" class="checkbox checkbox-sm" />
            <span class="label-text">{{ t('tools.passwordGenerator.excludeCli') }} (<code>& $ " ' / \ `</code>)</span>
          </label>
        </div>
      </div>
    </div>

    <button class="btn btn-success mb-4" @click="generate"><i class="fas fa-rotate mr-1"></i>{{ t('tools.passwordGenerator.generate') }}</button>

    <div v-if="generated" class="mb-4">
      <div class="flex items-center gap-3">
        <code class="flex-1 text-lg p-4 bg-base-300 rounded-box break-all font-mono">{{ generated }}</code>
        <button class="btn btn-outline btn-sm" @click="copy"><i class="fas fa-copy"></i></button>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-mono font-bold mb-3">{{ t('tools.passwordGenerator.entropy') }}</h2>
      <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
        <div class="stat-title">{{ t('tools.passwordGenerator.charSpace') }}</div>
        <div class="stat-value text-lg font-mono">{{ charset.length }}</div>
        <div class="stat-desc">{{ (Math.log2(charset.length) * length).toFixed(1) }} {{ t('tools.passwordGenerator.entropyDesc', { len: length }) }}</div>
      </div>
    </div>
  </div>
</template>
