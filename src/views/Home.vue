<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { useI18n } from '@/i18n'

const router = useRouter()
const store = useAppStore()
const { t } = useI18n()

const toolKeys = [
  {
    catKey: 'ssh',
    icon: 'fa-key',
    color: 'border-l-success',
    badge: 'badge-success',
    tools: [
      { key: 'sshKeyGenerator', icon: 'fa-key', path: '/ssh-key-generator' },
      { key: 'publicKeyAnalyzer', icon: 'fa-microscope', path: '/public-key-analyzer' },
      { key: 'sshConfigGenerator', icon: 'fa-gear', path: '/ssh-config-generator' },
      { key: 'keyFormatConverter', icon: 'fa-arrows-rotate', path: '/key-format-converter' },
      { key: 'sshInstallAssistant', icon: 'fa-cloud-upload-alt', path: '/ssh-install-assistant' },
      { key: 'chmodCheatSheet', icon: 'fa-lock', path: '/chmod-cheat-sheet' },
    ],
  },
  {
    catKey: 'securite',
    icon: 'fa-shield-halved',
    color: 'border-l-info',
    badge: 'badge-info',
    tools: [
      { key: 'passwordGenerator', icon: 'fa-key', path: '/password-generator' },
      { key: 'envKeyGenerator', icon: 'fa-file-code', path: '/env-key-generator' },
      { key: 'hashChecker', icon: 'fa-fingerprint', path: '/hash-checker' },
    ],
  },
  {
    catKey: 'reseau',
    icon: 'fa-network-wired',
    color: 'border-l-warning',
    badge: 'badge-warning',
    tools: [
      { key: 'subnetCalculator', icon: 'fa-network-wired', path: '/subnet-calculator' },
      { key: 'nginxGenerator', icon: 'fa-server', path: '/nginx-generator' },
      { key: 'cronGenerator', icon: 'fa-clock', path: '/cron-generator' },
    ],
  },
  {
    catKey: 'donnees',
    icon: 'fa-code',
    color: 'border-l-error',
    badge: 'badge-error',
    tools: [
      { key: 'formatConverter', icon: 'fa-exchange-alt', path: '/format-converter' },
      { key: 'linterFormatter', icon: 'fa-check-double', path: '/linter-formatter' },
      { key: 'swissKnifeEncoder', icon: 'fa-tools', path: '/swiss-knife-encoder' },
    ],
  },
]

const categories = computed(() =>
  toolKeys.map(cat => ({
    title: t(`home.categories.${cat.catKey}`),
    icon: cat.icon,
    color: cat.color,
    badge: cat.badge,
    tools: cat.tools.map(tool => ({
      title: t(`tools.${tool.key}.title`),
      desc: t(`tools.${tool.key}.desc`),
      icon: tool.icon,
      path: tool.path,
    })),
  }))
)

const starredTools = computed(() => store.getStarredTools())

function handleStar(e, path) {
  e.stopPropagation()
  store.toggleStarred(path)
}
</script>

<template>
  <div class="text-center mb-10">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-6">
      <i class="fas fa-terminal text-3xl text-success"></i>
    </div>
    <h1 class="text-5xl font-mono font-bold mb-3 tracking-tight">
      {{ t('home.title') }}
    </h1>
    <p class="text-lg text-base-content/60 max-w-2xl mx-auto leading-relaxed mb-6">
      {{ t('home.subtitle') }}
    </p>
    <a
      href="https://github.com/lighscent/desktop.engineer"
      target="_blank"
      rel="noopener noreferrer"
      class="btn btn-outline btn-sm gap-2"
    >
      <i class="fab fa-github text-base"></i>
      <span>{{ t('home.github') }}</span>
    </a>
    <p class="mt-3 text-xs text-base-content/40 font-mono">
      {{ t('home.stack') }}
    </p>
  </div>

  <div v-if="starredTools.length" class="mb-14">
    <div class="flex items-center gap-4 mb-5">
      <div class="flex items-center gap-3">
        <i class="fas fa-star text-xl text-warning"></i>
        <h2 class="text-xl font-mono font-bold">{{ t('home.favorites') }}</h2>
      </div>
      <span class="flex-1 h-px bg-base-300"></span>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tool in starredTools"
        :key="tool.path"
        class="btn btn-outline btn-sm gap-2"
        @click="router.push(tool.path)"
      >
        <i class="fas fa-star text-warning text-xs"></i>
        <span class="font-mono">{{ tool.title }}</span>
      </button>
    </div>
  </div>

  <div v-for="(cat, ci) in categories" :key="ci" class="mb-14">
    <div class="flex items-center gap-4 mb-7">
      <div class="flex items-center gap-3">
        <i :class="'fas ' + cat.icon + ' text-xl opacity-70'"></i>
        <h2 class="text-2xl font-mono font-bold">{{ cat.title }}</h2>
      </div>
      <span class="flex-1 h-px bg-base-300"></span>
      <span :class="'badge ' + cat.badge + ' badge-sm gap-1'">
        <i class="fas fa-cube text-xs"></i>
        {{ cat.tools.length }}
      </span>
    </div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="tool in cat.tools"
        :key="tool.path"
        class="card bg-base-200/60 backdrop-blur-sm border border-base-300 hover:border-base-content/30 hover:-translate-y-0.5 cursor-pointer transition-all duration-200 group"
        :class="cat.color"
        style="border-left-width: 4px;"
        @click="router.push(tool.path)"
      >
        <div class="card-body py-4 px-5">
          <div class="flex items-start justify-between">
            <h3 class="card-title font-mono text-sm gap-2 flex-1 min-w-0">
              <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-base-300/70 text-base-content/70 shrink-0">
                <i :class="'fas ' + tool.icon + ' text-xs'"></i>
              </span>
              <span class="truncate">{{ tool.title }}</span>
            </h3>
            <button
              class="btn btn-ghost btn-xs btn-square shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -mr-1 -mt-1"
              :class="{ '!opacity-100': store.isStarred(tool.path) }"
              :aria-label="t('a11y.star')"
              @click="handleStar($event, tool.path)"
            >
              <i
                class="fas fa-star text-xs"
                :class="store.isStarred(tool.path) ? 'text-warning' : 'text-base-content/30'"
              ></i>
            </button>
          </div>
          <p class="text-xs text-base-content/50 leading-relaxed ml-9">{{ tool.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
