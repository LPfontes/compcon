import { i18n } from './locales/i18n'
// @ts-ignore
import * as enData from '@massif/lancer-data-en'
// @ts-ignore
import * as ptData from 'lancer-data-pt-br'

/**
 * Obtém o conjunto de dados (source) baseado no idioma atual.
 */
function getSource() {
  const locale = i18n.global.locale.value
  const isPt = locale === 'pt-BR' || locale === 'pt'
  return isPt ? ptData : enData
}

/**
 * Este Proxy intercepta acessos ao objeto lancerData.
 * Ele verifica o idioma atual do i18n e retorna o dado da biblioteca correspondente.
 */
const lancerDataProxy = new Proxy({} as any, {
  get(_, prop) {
    return getSource()[prop]
  },
  ownKeys() {
    return Reflect.ownKeys(getSource())
  },
  getOwnPropertyDescriptor(_, prop) {
    return Reflect.getOwnPropertyDescriptor(getSource(), prop)
  }
})

/**
 * Função auxiliar para criar proxies para exportações nomeadas (ex: actions, weapons).
 * Redireciona o acesso diretamente para o campo correspondente no source atual.
 */
function createNamedProxy(key: string) {
  return new Proxy({} as any, {
    get(_, prop) {
      const source = getSource()
      if (source && source[key]) {
        return source[key][prop]
      }
      return undefined
    },
    ownKeys() {
      const source = getSource()
      return source && source[key] ? Reflect.ownKeys(source[key]) : []
    },
    getOwnPropertyDescriptor(_, prop) {
      const source = getSource()
      return source && source[key] ? Reflect.getOwnPropertyDescriptor(source[key], prop) : undefined
    }
  })
}

// Exportações nomeadas para compatibilidade com import { ... }
export const actions = createNamedProxy('actions')
export const backgrounds = createNamedProxy('backgrounds')
export const core_bonuses = createNamedProxy('core_bonuses')
export const downtime_actions = createNamedProxy('downtime_actions')
export const environments = createNamedProxy('environments')
export const frames = createNamedProxy('frames')
export const glossary = createNamedProxy('glossary')
export const info = createNamedProxy('info')
export const lists = createNamedProxy('lists')
export const manufacturers = createNamedProxy('manufacturers')
export const mods = createNamedProxy('mods')
export const npc_classes = createNamedProxy('npc_classes')
export const npc_features = createNamedProxy('npc_features')
export const npc_templates = createNamedProxy('npc_templates')
export const pilot_gear = createNamedProxy('pilot_gear')
export const reserves = createNamedProxy('reserves')
export const rules = createNamedProxy('rules')
export const sitreps = createNamedProxy('sitreps')
export const skills = createNamedProxy('skills')
export const statuses = createNamedProxy('statuses')
export const systems = createNamedProxy('systems')
export const tables = createNamedProxy('tables')
export const tags = createNamedProxy('tags')
export const talents = createNamedProxy('talents')
export const weapons = createNamedProxy('weapons')

export default lancerDataProxy
