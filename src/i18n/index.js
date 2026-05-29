import { ref } from 'vue'
import fr from './locales/fr'
import en from './locales/en'

const messages = { fr, en }

const saved = localStorage.getItem('de_locale')
const locale = ref(saved === 'en' ? 'en' : 'fr')

document.documentElement.lang = locale.value

function t(key, params = {}) {
  const keys = key.split('.')
  let val = messages[locale.value]
  for (const k of keys) {
    if (val && typeof val === 'object' && k in val) val = val[k]
    else return key
  }
  if (typeof val !== 'string') return key
  return val.replace(/\{(\w+)\}/g, (_, k) => params[k] !== undefined ? params[k] : `{${k}}`)
}

function setLocale(l) {
  locale.value = l
  localStorage.setItem('de_locale', l)
  document.documentElement.lang = l
}

export function useI18n() {
  return { locale, t, setLocale }
}
