/* Conteo de cifras al entrar en pantalla (curva ease-out cúbica). */
import { ref } from 'vue'

export function useCountUp(targets, { duration = 1200, stagger = 120, format = (n) => String(n), initial } = {}) {
  const values = ref(targets.map((to, k) => (initial ? initial(to, k) : format(to))))
  let raf = []
  function start({ skip = () => false, reduce = false } = {}) {
    targets.forEach((to, k) => {
      if (skip(to, k)) return
      if (reduce) { values.value[k] = format(to); return }
      const t0 = performance.now() + k * stagger
      values.value[k] = format(0)
      const f = (now) => {
        const q = Math.min(1, Math.max(0, (now - t0) / duration))
        const e = 1 - Math.pow(1 - q, 3)
        values.value[k] = format(Math.round(to * e))
        if (q < 1) raf[k] = requestAnimationFrame(f)
      }
      f(t0)
    })
  }
  function stop() { raf.forEach((r) => cancelAnimationFrame(r)) }
  return { values, start, stop }
}
