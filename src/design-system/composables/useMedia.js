/* Media queries reactivas y preferencia de movimiento reducido. */
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useMediaQuery(query) {
  const mq = window.matchMedia(query)
  const matches = ref(mq.matches)
  const on = (e) => { matches.value = e.matches }
  onMounted(() => mq.addEventListener('change', on))
  onBeforeUnmount(() => mq.removeEventListener('change', on))
  return matches
}

/* Como en el original, se lee una vez al cargar la página. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
