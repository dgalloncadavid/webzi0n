/* Título y meta description de la página, en el idioma activo. */
import { watchEffect, onBeforeUnmount } from 'vue'
import { lang } from './useLang'

export function usePageMeta(dict, { title, description, translateDescription = true, noindex = false }) {
  const meta = document.querySelector('meta[name="description"]')
  let robots = null
  if (noindex) {
    robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
  }
  watchEffect(() => {
    const en = lang.value === 'en'
    document.title = en && dict[title] ? dict[title] : title
    if (meta) meta.setAttribute('content', en && translateDescription && dict[description] ? dict[description] : description)
  })
  onBeforeUnmount(() => { if (robots) robots.remove() })
}
