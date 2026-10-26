/* Idioma ES / EN.
   Igual que el original: los diccionarios traducen del texto en español al inglés;
   un texto que no está en el diccionario se queda en español.
   El idioma se guarda en localStorage 'zion-lang' y se puede forzar con ?lang=es|en. */
import { ref, watch, provide, inject } from 'vue'

const KEY = 'zion-lang'
const DICT = Symbol('zion-dict')

export const lang = ref('es')

export function setLang(l) {
  if (l !== 'es' && l !== 'en') return
  lang.value = l
  try { localStorage.setItem(KEY, l) } catch (e) { /* almacenamiento no disponible */ }
}

/* Al arrancar: ?lang= gana sobre lo guardado; si no hay nada, español. */
export function initLang(search = location.search) {
  const q = (search.match(/[?&]lang=(es|en)/) || [])[1]
  let s = null
  try { s = localStorage.getItem(KEY) } catch (e) { /* sin acceso */ }
  setLang(q || (s === 'en' || s === 'es' ? s : 'es'))
}

watch(lang, (l) => { document.documentElement.lang = l }, { immediate: true })

/* Traductor sobre un diccionario concreto */
export function makeT(dict) {
  const t = (s) => (lang.value === 'en' && dict[s] ? dict[s] : s)
  const fmt = (s, o) => t(s).replace(/\{(\w+)\}/g, (m, k) => o[k])
  return { t, fmt, lang }
}

/* La página entrega su diccionario; las secciones y componentes lo reciben */
export function provideDict(dict) {
  provide(DICT, dict)
  return makeT(dict)
}

export function useT() {
  return makeT(inject(DICT, {}))
}
