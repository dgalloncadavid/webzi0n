/* Páginas de pago: lee el pedido de la pestaña. Si se entra directo sin pedido
   completo, arma uno de demostración (renovación, 180 días), como el original. */
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { loadOrder, saveOrder, money, summaryLines, skipStore } from './order'

export function usePayOrder(page, t, fmt) {
  const router = useRouter()
  let o = loadOrder()
  if (!o || !o.email || !o.plan) {
    o = o || {}
    o.tipo = o.tipo || 'renovacion'
    o.tienda = o.tienda || 'exchange'
    o.plan = o.plan || '180'
    o.email = o.email || 'hola@correo.com'
    o.demo = true
  }
  o.metodo = page
  const O = reactive(o)
  const save = () => saveOrder({ ...O })
  /* pago "recibido": vuelve al checkout, que abre la pantalla final con ?done=1 */
  function done() { O.done = true; save(); router.push('/compra?done=1') }
  return {
    O,
    save,
    done,
    lines: computed(() => summaryLines(O, t, fmt)),
    total: computed(() => money(O, t)),
    showStore: computed(() => !skipStore(O))
  }
}
