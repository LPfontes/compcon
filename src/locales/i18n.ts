import { createI18n } from 'vue-i18n'
import en from './en.json'
import ptBR from './pt-BR.json'

// Exporting MessageSchema is useful for type checking if needed later
export type MessageSchema = typeof en

const getInitialLocale = (): string => {
  const savedLocale = localStorage.getItem('cc_locale')
  if (savedLocale) return savedLocale

  const browserLang = navigator.language
  if (browserLang.startsWith('pt')) return 'pt-BR'
  return 'en'
}

export const i18n = createI18n<[MessageSchema], 'en' | 'pt-BR'>({
  legacy: false, // Required for Vue 3 Composition API
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en: en,
    'pt-BR': ptBR,
  },
})
