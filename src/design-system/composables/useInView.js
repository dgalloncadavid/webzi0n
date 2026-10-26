/* Observa si un elemento está en pantalla. Sirve para que las ilustraciones
   y los ciclos automáticos solo corran mientras se ven. */
import { ref, onMounted, onBeforeUnmount, unref } from 'vue'

/* acepta un ref, un getter o una instancia de componente */
function resolve(x) {
  const v = typeof x === 'function' ? x() : unref(x)
  return v && v.$el ? v.$el : v
}

export function useInView(target, { threshold = 0.3, rootMargin = '0px', once = false, onChange } = {}) {
  const inView = ref(false)
  let io = null
  onMounted(() => {
    const el = resolve(target)
    if (!el) return
    io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        inView.value = e.isIntersecting
        if (onChange) onChange(e.isIntersecting, e)
        if (once && e.isIntersecting) io.disconnect()
      })
    }, { threshold, rootMargin })
    io.observe(el)
  })
  onBeforeUnmount(() => io && io.disconnect())
  return inView
}
