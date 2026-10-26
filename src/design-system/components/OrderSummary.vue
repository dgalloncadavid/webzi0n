<script setup>
/* Resumen del pedido. En escritorio queda fijo al costado; bajo 980 px sube arriba
   y se pliega con un botón que muestra el total.
   Cada valor parpadea en verde cuando cambia (o al cambiar de idioma).
   Slots: media (imagen arriba), footer (lista de incluidos o procesador de pago). */
import { ref, watch, nextTick } from 'vue'
import Icon from './Icon.vue'
import { lang, useT } from '../composables/useLang'

const props = defineProps({
  /** { tipo, tienda, plan, mail } ya traducidos; '-' si falta */
  lines: { type: Object, required: true },
  showStore: { type: Boolean, default: true },
  total: { type: String, default: '-' },
  title: { type: String, default: 'Tu Zi0n Cripto' },
  /** páginas de pago: más aire arriba porque no hay imagen */
  pay: { type: Boolean, default: false }
})
const { t } = useT()
const open = ref(false)
const KEYS = ['tipo', 'tienda', 'plan', 'mail']
const dd = {}
function flash(k) {
  const el = dd[k]
  if (!el) return
  el.classList.remove('flash'); void el.offsetWidth
  if (props.lines[k] !== '-') el.classList.add('flash')
}
KEYS.forEach((k) => watch(() => props.lines[k], () => nextTick(() => flash(k))))
watch(lang, () => nextTick(() => KEYS.forEach(flash)))
const LABELS = { tipo: 'Licencia', tienda: 'Tienda', plan: 'Plan', mail: 'Correo' }
const IDS = { tipo: 'sTipo', tienda: 'sTienda', plan: 'sPlan', mail: 'sMail' }
</script>

<template>
<aside class="summary" :class="{ open, 'summary--pay': pay }" id="summary" :aria-label="t('Resumen de la compra')">
      <button type="button" class="sum-toggle" id="sumToggle" :aria-expanded="String(open)" @click="open = !open"><span>{{ t('Resumen') }}</span><b id="sumTotalM">{{ total }}</b><span class="ico"><Icon name="chevron-down" /></span></button>
      <div class="sum-body">
        <slot name="media" />
        <h2 class="h5">{{ t(title) }}</h2>
        <dl class="lines">
          <div v-for="k in KEYS" :key="k" :hidden="k === 'tienda' && !showStore"><dt>{{ t(LABELS[k]) }}</dt><dd :ref="(el) => (dd[k] = el)" :id="IDS[k]">{{ lines[k] }}</dd></div>
        </dl>
        <div class="total"><span>{{ t('Total') }}</span><b id="sTotal">{{ total }}</b></div>
        <slot name="footer" />
      </div>
</aside>
</template>

<style scoped>
.summary{position:sticky;top:96px;border-radius:var(--radius-card);border:1px solid var(--color-line);background:rgba(var(--zn-surface-checkout-rgb),.75);backdrop-filter:blur(var(--zn-blur-12));-webkit-backdrop-filter:blur(var(--zn-blur-12));overflow:hidden}
.sum-toggle{display:none}
.sum-body{padding:0 var(--zn-space-24) var(--zn-space-24);display:flex;flex-direction:column;gap:var(--zn-space-16)}
.lines{display:flex;flex-direction:column;gap:var(--zn-space-10)}
.lines div{display:flex;justify-content:space-between;gap:var(--zn-space-12);font:var(--zn-weight-regular) 14px/20px var(--font-sans)}
.lines dt{color:var(--color-muted)}
.lines dd{color:var(--color-mist);text-align:right;font-weight:var(--zn-weight-medium);overflow-wrap:anywhere;transition:color var(--dur-medium)}
.lines dd.flash{animation:fl var(--zn-dur-800)}
@keyframes fl{0%{color:var(--color-signal)}100%{color:var(--color-mist)}}
.total{display:flex;justify-content:space-between;align-items:baseline;padding-top:var(--zn-space-14);border-top:1px dashed var(--color-line-strong)}
.total span{font:var(--zn-weight-medium) 13px/18px var(--font-mono);letter-spacing:.6px;text-transform:uppercase;color:var(--color-ice)}
.total b{font:var(--zn-weight-extrabold) 28px/34px var(--font-mono);letter-spacing:-.5px;color:var(--color-mist)}
@media (max-width:980px){
  .summary{position:relative;top:auto;order:-1;border-radius:var(--zn-radius-18)}
  .sum-toggle{display:flex;align-items:center;gap:var(--zn-space-10);width:100%;padding:var(--zn-space-14) var(--zn-space-18);font:var(--zn-weight-medium) 14px/20px var(--font-sans);color:var(--color-ice)}
  .sum-toggle span:first-child{flex:1}
  .sum-toggle b{font:var(--zn-weight-extrabold) 16px/22px var(--font-mono);color:var(--color-mist)}
  .sum-toggle .ico{width:18px;height:18px;transition:transform var(--dur-medium) var(--ease)}
  .summary.open .sum-toggle .ico{transform:rotate(180deg)}
  .sum-body{display:none;padding-top:var(--zn-space-4)}
  .summary.open .sum-body{display:flex}
}
.summary--pay .sum-body{padding-top:var(--zn-space-24)}
</style>
