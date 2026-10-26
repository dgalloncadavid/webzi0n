/* Menú móvil: estado compartido, clase html.menu-open (bloquea el scroll del body),
   Escape lo cierra y también al pasar a escritorio. */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const open = ref(false)
watch(open, (o) => document.documentElement.classList.toggle('menu-open', o))

export function useMenu() {
  const mq = window.matchMedia('(max-width:1023px)')
  const onKey = (e) => { if (e.key === 'Escape') open.value = false }
  const onMq = (e) => { if (!e.matches) open.value = false }
  onMounted(() => {
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKey)
    mq.removeEventListener('change', onMq)
    open.value = false
  })
  return {
    open,
    toggle: () => { open.value = !open.value },
    close: () => { open.value = false }
  }
}
