import { ref } from 'vue'
import fr from './locales/fr'
import en from './locales/en'

const messages = { fr, en }

const consent = localStorage.getItem('de_cookie')
const saved = consent === 'true' ? localStorage.getItem('de_locale') : null
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
  document.documentElement.lang = l
  if (localStorage.getItem('de_cookie') === 'true') {
    localStorage.setItem('de_locale', l)
  }
}

export function useI18n() {
  return { locale, t, setLocale }
}
