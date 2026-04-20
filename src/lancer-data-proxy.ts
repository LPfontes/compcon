import { i18n } from './locales/i18n'
// @ts-ignore
import * as enData from '@massif/lancer-data-en'
// @ts-ignore
import * as ptData from '@massif/lancer-data-pt'

/**
 * Este Proxy intercepta acessos ao objeto lancerData.
 * Ele verifica o idioma atual do i18n e retorna o dado da biblioteca correspondente.
 */
const lancerDataProxy = new Proxy({} as any, {
  get(_, prop) {
    const locale = i18n.global.locale.value
    const isPt = locale === 'pt-BR' || locale === 'pt'
    const source = isPt ? ptData : enData
    return source[prop]
  },
  ownKeys() {
    const locale = i18n.global.locale.value
    const isPt = locale === 'pt-BR' || locale === 'pt'
    return Reflect.ownKeys(isPt ? ptData : enData)
  },
  getOwnPropertyDescriptor(target, prop) {
    const locale = i18n.global.locale.value
    const isPt = locale === 'pt-BR' || locale === 'pt'
    return Reflect.getOwnPropertyDescriptor(isPt ? ptData : enData, prop)
  }
})

// Função auxiliar para criar proxies reativos para exportações nomeadas
function createNamedProxy(key: string) {
  return new Proxy({} as any, {
    get(_, prop) {
      return lancerDataProxy[key][prop]
    },
    ownKeys() {
      return Reflect.ownKeys(lancerDataProxy[key])
    },
    getOwnPropertyDescriptor(_, prop) {
      return Reflect.getOwnPropertyDescriptor(lancerDataProxy[key], prop)
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
