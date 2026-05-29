<script setup>
import { useAppStore } from '@/stores/appStore'
import { useI18n } from '@/i18n'

const { state, acceptCookies, declineCookies } = useAppStore()
const { t } = useI18n()
</script>

<template>
  <div
    v-if="state.cookieConsent === null"
    class="fixed bottom-0 right-0 z-50 m-4 sm:m-6 max-w-sm"
  >
    <div class="card bg-base-200 border border-base-300 shadow-xl">
      <div class="card-body p-5">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-cookie-bite text-xl text-warning"></i>
          <h3 class="font-mono font-bold">{{ t('cookie.title') }}</h3>
        </div>
        <p class="text-sm text-base-content/70 leading-relaxed mb-4">
          {{ t('cookie.desc') }}
        </p>
        <div class="flex gap-2">
          <button class="btn btn-success btn-sm flex-1" @click="acceptCookies">
            <i class="fas fa-check mr-1"></i>{{ t('cookie.accept') }}
          </button>
          <button class="btn btn-ghost btn-sm" @click="declineCookies">
            {{ t('cookie.decline') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
