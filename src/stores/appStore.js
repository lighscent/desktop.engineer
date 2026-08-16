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

function remove(key) {
  localStorage.removeItem(key)
}

const initialConsent = load(KEYS.cookie, null)

const state = reactive({
  cookieConsent: initialConsent,
  starred: initialConsent === true ? load(KEYS.starred, []) : [],
  lastUsed: initialConsent === true ? load(KEYS.lastUsed, {}) : {},
  configs: initialConsent === true ? load(KEYS.configs, {}) : {},
})

function persistNow() {
  save(KEYS.starred, state.starred)
  save(KEYS.lastUsed, state.lastUsed)
  save(KEYS.configs, state.configs)
}

function clearStorage() {
  remove(KEYS.starred)
  remove(KEYS.lastUsed)
  remove(KEYS.configs)
}

watch(() => state.starred, v => { if (state.cookieConsent === true) save(KEYS.starred, v) }, { deep: true })
watch(() => state.lastUsed, v => { if (state.cookieConsent === true) save(KEYS.lastUsed, v) }, { deep: true })
watch(() => state.configs, v => { if (state.cookieConsent === true) save(KEYS.configs, v) }, { deep: true })
watch(() => state.cookieConsent, v => save(KEYS.cookie, v))

const allTools = [
  { path: '/ssh/ssh-key-generator', title: 'Générateur de Clés SSH' },
  { path: '/ssh/public-key-analyzer', title: 'Inspecteur de Clé Publique' },
  { path: '/ssh/ssh-config-generator', title: 'Générateur ~/.ssh/config' },
  { path: '/ssh/key-format-converter', title: 'Convertisseur OpenSSH ↔ PuTTY' },
  { path: '/ssh/ssh-install-assistant', title: 'Assistant d\'Installation' },
  { path: '/ssh/chmod-cheat-sheet', title: 'Aide-mémoire chmod' },
  { path: '/security/password-generator', title: 'Générateur de Mots de Passe' },
  { path: '/security/env-key-generator', title: 'Clés d\'Applications (.env)' },
  { path: '/security/hash-checker', title: 'Vérificateur de Checksum' },
  { path: '/network/ip-info', title: 'Recherche IP' },
  { path: '/network/subnet-calculator', title: 'Calculateur de Subnet CIDR' },
  { path: '/server/nginx-generator', title: 'Générateur Nginx' },
  { path: '/server/ssl-cert-generator', title: 'Certificat SSL Auto-signé' },
  { path: '/server/cron-generator', title: 'Générateur Cron' },
  { path: '/data/format-converter', title: 'Convertisseur JSON / YAML / CSV' },
  { path: '/data/linter-formatter', title: 'Linter JSON / YAML' },
  { path: '/data/swiss-knife-encoder', title: 'Couteau Suisse Encode/Décode' },
]

export function useAppStore() {
  function acceptCookies() {
    state.cookieConsent = true
    persistNow()
  }
  function declineCookies() {
    state.cookieConsent = false
    clearStorage()
  }

  function toggleStarred(path) {
    if (state.cookieConsent !== true) return
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
