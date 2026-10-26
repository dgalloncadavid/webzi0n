/* CTA magnético: el botón sigue al puntero cuando está a menos de 180 px. */
import { onMounted, onBeforeUnmount, unref } from 'vue'
import { prefersReducedMotion } from './useMedia'

/* acepta un ref, un getter o una instancia de componente */
function resolve(x) {
  const v = typeof x === 'function' ? x() : unref(x)
  return v && v.$el ? v.$el : v
}

export function useMagnetic(button, area, { kx = 0.2, ky = 0.28, radius = 180, mouseOnly = true } = {}) {
  let a = null
  const move = (e) => {
    if (mouseOnly && e.pointerType !== 'mouse') return
    const b = resolve(button)
    const r = b.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    const d = Math.hypot(dx, dy)
    b.style.transform = d < radius ? 'translate(' + (dx * kx).toFixed(1) + 'px,' + (dy * ky).toFixed(1) + 'px)' : ''
  }
  const leave = () => { const b = resolve(button); if (b) b.style.transform = '' }
  onMounted(() => {
    a = resolve(area)
    if (!a || !resolve(button) || prefersReducedMotion()) return
    a.addEventListener('pointermove', move)
    a.addEventListener('pointerleave', leave)
  })
  onBeforeUnmount(() => {
    if (!a) return
    a.removeEventListener('pointermove', move)
    a.removeEventListener('pointerleave', leave)
  })
}
