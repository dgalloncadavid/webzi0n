/* Spotlight: guarda la posición del puntero en --mx y --my para un degradado radial. */
import { onMounted, onBeforeUnmount, unref } from 'vue'
import { prefersReducedMotion } from './useMedia'

export function useSpotlight(target) {
  let el = null
  const move = (e) => {
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px')
    el.style.setProperty('--my', (e.clientY - r.top) + 'px')
  }
  onMounted(() => {
    el = typeof target === 'function' ? target() : unref(target)
    if (el && el.$el) el = el.$el
    if (!el || prefersReducedMotion()) return
    el.addEventListener('pointermove', move)
  })
  onBeforeUnmount(() => { if (el) el.removeEventListener('pointermove', move) })
}
