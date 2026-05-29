import { reactive, watch } from 'vue'

const KEYS = {
  cookie: 'de_cookie',
  starred: 'de_starred',
  lastUsed: 'de_last_used',
  configs: 'de_configs',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

const state = reactive({
  cookieConsent: load(KEYS.cookie, null),
  starred: load(KEYS.starred, []),
  lastUsed: load(KEYS.lastUsed, {}),
  configs: load(KEYS.configs, {}),
})

watch(() => state.starred, v => save(KEYS.starred, v), { deep: true })
watch(() => state.lastUsed, v => save(KEYS.lastUsed, v), { deep: true })
watch(() => state.configs, v => save(KEYS.configs, v), { deep: true })
watch(() => state.cookieConsent, v => save(KEYS.cookie, v))

const allTools = [
  { path: '/ssh-key-generator', title: 'Générateur de Clés SSH' },
  { path: '/public-key-analyzer', title: 'Inspecteur de Clé Publique' },
  { path: '/ssh-config-generator', title: 'Générateur ~/.ssh/config' },
  { path: '/key-format-converter', title: 'Convertisseur OpenSSH ↔ PuTTY' },
  { path: '/ssh-install-assistant', title: 'Assistant d\'Installation' },
  { path: '/chmod-cheat-sheet', title: 'Aide-mémoire chmod' },
  { path: '/password-generator', title: 'Générateur de Mots de Passe' },
  { path: '/env-key-generator', title: 'Clés d\'Applications (.env)' },
  { path: '/hash-checker', title: 'Vérificateur de Checksum' },
  { path: '/subnet-calculator', title: 'Calculateur de Subnet CIDR' },
  { path: '/nginx-generator', title: 'Générateur Nginx' },
  { path: '/cron-generator', title: 'Générateur Cron' },
  { path: '/format-converter', title: 'Convertisseur JSON / YAML / CSV' },
  { path: '/linter-formatter', title: 'Linter JSON / YAML' },
  { path: '/swiss-knife-encoder', title: 'Couteau Suisse Encode/Décode' },
]

export function useAppStore() {
  function acceptCookies() { state.cookieConsent = true }
  function declineCookies() { state.cookieConsent = false }

  function toggleStarred(path) {
    const idx = state.starred.indexOf(path)
    if (idx >= 0) state.starred.splice(idx, 1)
    else state.starred.push(path)
  }

  function isStarred(path) {
    return state.starred.includes(path)
  }

  function trackUsed(path) {
    if (state.cookieConsent && path !== '/') {
      state.lastUsed[path] = Date.now()
    }
  }

  function getLastUsed() {
    return Object.entries(state.lastUsed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path]) => {
        const tool = allTools.find(t => t.path === path)
        return { path, title: tool ? tool.title : path }
      })
  }

  function getStarredTools() {
    return state.starred
      .map(path => {
        const tool = allTools.find(t => t.path === path)
        return tool ? { path, title: tool.title } : null
      })
      .filter(Boolean)
  }

  function saveConfig(toolId, config) {
    if (state.cookieConsent) {
      state.configs[toolId] = config
    }
  }

  function loadConfig(toolId) {
    return state.configs[toolId] || null
  }

  return {
    state,
    acceptCookies,
    declineCookies,
    toggleStarred,
    isStarred,
    trackUsed,
    getLastUsed,
    getStarredTools,
    saveConfig,
    loadConfig,
    allTools,
  }
}
