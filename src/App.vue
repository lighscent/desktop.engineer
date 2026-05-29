<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { useI18n } from '@/i18n'
import { applySeo } from '@/seo'
import CookieConsent from '@/components/CookieConsent.vue'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const hoveredCat = ref(null)
const dropdownTimer = ref(null)
const store = useAppStore()
const { locale, t, setLocale } = useI18n()

watch(() => route.path, (path) => {
  store.trackUsed(path)
  mobileMenuOpen.value = false
  applySeo(path, t)
}, { immediate: true })

const catKeys = [
  {
    key: 'ssh',
    icon: 'fa-key',
    items: [
      { key: 'keyGenerator', path: '/ssh-key-generator' },
      { key: 'keyAnalyzer', path: '/public-key-analyzer' },
      { key: 'sshConfig', path: '/ssh-config-generator' },
      { key: 'keyConverter', path: '/key-format-converter' },
      { key: 'installAssistant', path: '/ssh-install-assistant' },
      { key: 'chmod', path: '/chmod-cheat-sheet' },
    ],
  },
  {
    key: 'securite',
    icon: 'fa-shield-halved',
    items: [
      { key: 'password', path: '/password-generator' },
      { key: 'envKey', path: '/env-key-generator' },
      { key: 'hash', path: '/hash-checker' },
    ],
  },
  {
    key: 'reseau',
    icon: 'fa-network-wired',
    items: [
      { key: 'subnet', path: '/subnet-calculator' },
      { key: 'nginx', path: '/nginx-generator' },
      { key: 'cron', path: '/cron-generator' },
    ],
  },
  {
    key: 'donnees',
    icon: 'fa-code',
    items: [
      { key: 'format', path: '/format-converter' },
      { key: 'linter', path: '/linter-formatter' },
      { key: 'encoder', path: '/swiss-knife-encoder' },
    ],
  },
]

const categories = computed(() =>
  catKeys.map(cat => ({
    name: t(`nav.${cat.key}`),
    icon: cat.icon,
    items: cat.items.map(item => ({ name: t(`nav.items.${item.key}`), path: item.path })),
  }))
)

function navigate(path) {
  router.push(path)
}

function openDropdown(name) {
  if (dropdownTimer.value) {
    clearTimeout(dropdownTimer.value)
    dropdownTimer.value = null
  }
  hoveredCat.value = name
}

function closeDropdown() {
  dropdownTimer.value = setTimeout(() => {
    hoveredCat.value = null
  }, 100)
}

onBeforeUnmount(() => {
  if (dropdownTimer.value) clearTimeout(dropdownTimer.value)
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <div class="navbar bg-base-200/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50 px-4">
      <div class="navbar-start">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost btn-square lg:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
            <i class="fas fa-bars text-lg"></i>
          </label>
          <ul v-if="mobileMenuOpen" class="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-200 rounded-box w-64 border border-base-300">
            <li><a :class="{ active: route.path === '/' }" @click="navigate('/')"><i class="fas fa-home w-5"></i>{{ t('nav.home') }}</a></li>
            <li v-for="cat in categories" :key="cat.name" class="menu-title mt-2">
              <span><i :class="'fas ' + cat.icon + ' w-5'"></i> {{ cat.name }}</span>
              <ul>
                <li v-for="item in cat.items" :key="item.path">
                  <a :class="{ active: route.path === item.path }" @click="navigate(item.path)">{{ item.name }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <a class="btn btn-ghost text-lg font-mono gap-1.5 px-2" @click="navigate('/')">
          <span class="text-success font-bold">~/></span>
          <span class="hidden sm:inline">{{ t('nav.brand') }}</span>
        </a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 text-sm gap-1">
          <li
            v-for="cat in categories"
            :key="cat.name"
            class="dropdown"
            :class="{ 'dropdown-open': hoveredCat === cat.name }"
            @mouseenter="openDropdown(cat.name)"
            @mouseleave="closeDropdown()"
          >
            <a
              class="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors duration-150"
              :class="{ 'text-base-content': cat.items.some(i => route.path === i.path), 'text-base-content/60': !cat.items.some(i => route.path === i.path) }"
            >
              <i :class="'fas ' + cat.icon + ' text-xs'"></i>
              <span>{{ cat.name }}</span>
              <i class="fas fa-chevron-down text-[10px] opacity-40"></i>
            </a>
            <ul
              class="dropdown-content menu p-2 shadow-xl bg-base-200 rounded-box w-56 border border-base-300"
              @mouseenter="openDropdown(cat.name)"
              @mouseleave="closeDropdown()"
            >
              <li v-for="item in cat.items" :key="item.path">
                <a :class="{ active: route.path === item.path }" @click="navigate(item.path)">{{ item.name }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="navbar-end gap-2">
        <a href="https://github.com/lighscent/desktop.engineer" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-square" title="GitHub">
          <i class="fab fa-github text-lg"></i>
        </a>
        <button class="btn btn-ghost btn-sm gap-1.5" @click="setLocale(locale === 'fr' ? 'en' : 'fr')">
          <i class="fas fa-globe text-sm"></i>
          <span class="font-mono text-xs font-bold">{{ locale === 'fr' ? 'EN' : 'FR' }}</span>
        </button>
        <label class="swap swap-rotate btn btn-ghost btn-square">
          <input type="checkbox" class="theme-controller" value="light" />
          <i class="swap-off fas fa-sun text-lg"></i>
          <i class="swap-on fas fa-moon text-lg"></i>
        </label>
      </div>
    </div>

    <main class="flex-1 container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
      <router-view />
    </main>

    <footer class="flex flex-col items-center gap-1.5 px-4 py-5 bg-base-200 border-t border-base-300 text-sm text-base-content/60">
      <div class="flex items-center gap-2">
        <span class="font-mono text-success text-xs">~/></span>
        <span>{{ t('footer.text') }}</span>
      </div>
      <div class="flex flex-wrap justify-center gap-x-5 gap-y-1">
        <a href="https://github.com/lighscent/desktop.engineer/issues/new?template=bug_report.yml" target="_blank" rel="noopener noreferrer" class="link link-hover inline-flex items-center gap-1.5">
          <i class="fas fa-bug text-xs"></i> {{ t('footer.bug') }}
        </a>
        <a href="https://github.com/lighscent/desktop.engineer/issues/new?template=feature_request.yml" target="_blank" rel="noopener noreferrer" class="link link-hover inline-flex items-center gap-1.5">
          <i class="fas fa-lightbulb text-xs"></i> {{ t('footer.suggestion') }}
        </a>
        <a href="https://github.com/lighscent/desktop.engineer" target="_blank" rel="noopener noreferrer" class="link link-hover inline-flex items-center gap-1.5">
          <i class="fab fa-github text-xs"></i> GitHub
        </a>
        <a href="https://discord.gg/YmA88jc7GF" target="_blank" rel="noopener noreferrer" class="link link-hover inline-flex items-center gap-1.5 opacity-60 hover:opacity-100">
          <i class="fab fa-discord text-xs"></i> {{ t('footer.discord') }}
        </a>
      </div>
    </footer>

    <CookieConsent />
  </div>
</template>
