/* Enlaces: las rutas internas navegan con el router sin recargar;
   las anclas (#faq) y las URLs externas quedan como enlaces normales. */
import { computed, unref } from 'vue'
import { useRouter } from 'vue-router'

export function isRouteLink(to) {
  return typeof to === 'object' || (typeof to === 'string' && to.startsWith('/'))
}

export function useLinkTo(target) {
  const router = useRouter()
  const href = computed(() => {
    const to = unref(target)
    if (to == null) return undefined
    return isRouteLink(to) ? router.resolve(to).href : to
  })
  function onClick(e) {
    const to = unref(target)
    if (!isRouteLink(to)) return
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    router.push(to)
  }
  return { href, onClick }
}
