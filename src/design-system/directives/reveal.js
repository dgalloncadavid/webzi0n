/* v-reveal: agrega la clase .in la primera vez que el elemento entra en pantalla.
   Cada página fija su umbral con setRevealOptions() (el original usaba .15, .18 o .2).
   Si Vue vuelve a escribir las clases del elemento, el hook updated repone .in. */
let current = { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
const observers = new Map()

export function setRevealOptions(opts) {
  current = { ...current, ...opts }
}

function observerFor(opts) {
  const key = opts.threshold + '|' + opts.rootMargin
  if (!observers.has(key)) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('in')
        e.target.__revealed = true
        io.unobserve(e.target)
        if (e.target.__onReveal) e.target.__onReveal()
      })
    }, opts)
    observers.set(key, io)
  }
  return observers.get(key)
}

export const vReveal = {
  mounted(el, binding) {
    if (typeof binding.value === 'function') el.__onReveal = binding.value
    el.__io = observerFor(current)
    el.__io.observe(el)
  },
  updated(el) {
    if (el.__revealed && !el.classList.contains('in')) el.classList.add('in')
  },
  unmounted(el) {
    if (el.__io) el.__io.unobserve(el)
  }
}
