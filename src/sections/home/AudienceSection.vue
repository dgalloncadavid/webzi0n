<script setup>
/* Inicio · para quién (sección clara): bento de perfiles, flujo animado de abogados
   y carrusel con indicador en celulares. */
import { ref, onBeforeUnmount } from 'vue'
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import Card from '@/design-system/components/Card.vue'
import Button from '@/design-system/components/Button.vue'
import CalloutCard from '@/design-system/components/CalloutCard.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'
import { useInView } from '@/design-system/composables/useInView'
import { prefersReducedMotion, useMediaQuery } from '@/design-system/composables/useMedia'

const { t } = useT()
const reduce = prefersReducedMotion()
/* en celulares la fila es un carrusel con scroll: se vuelve región enfocable para moverla con el teclado */
const carousel = useMediaQuery('(max-width:640px)')

/* abogados: el flujo se ilumina paso a paso mientras se ve */
const flowEl = ref(null)
const step = ref(-1)
let tm = null
function go() { step.value = (step.value + 1) % 3 }
useInView(flowEl, {
  threshold: 0.6,
  onChange(on) {
    if (on && !tm && !reduce) { go(); tm = setInterval(go, 1800) }
    else if (!on) { clearInterval(tm); tm = null }
  }
})
onBeforeUnmount(() => clearInterval(tm))

/* carrusel de perfiles en celulares: punto activo según la tarjeta visible */
const row = ref(null)
const active = ref(0)
function onScroll() {
  const el = row.value
  const cards = Array.from(el.querySelectorAll('.pcard'))
  const l = el.getBoundingClientRect().left
  let best = 0
  let min = 1e9
  cards.forEach((c, k) => { const d = Math.abs(c.getBoundingClientRect().left - l - 20); if (d < min) { min = d; best = k } })
  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = cards.length - 1
  active.value = best
}

const flow = [
  { c: 'var(--color-muted)', label: 'Teléfono perdido' },
  { c: 'var(--zn-warning)', label: 'Sin PIN a tiempo' },
  { c: 'var(--zn-danger-deep)', label: 'Capa oculta borrada' }
]
const row3 = [
  { k: 'var(--zn-persona-journalist-rgb)', d: null, icon: 'microphone-2', eyebrow: 'Periodistas', title: 'Fuentes que confían en ti', text: 'Contactos y notas en una capa aparte, con cámara y micrófono apagados cuando no los usas.' },
  { k: 'var(--zn-persona-executive-rgb)', d: '.08s', icon: 'briefcase', eyebrow: 'Ejecutivos', title: 'Viajes, reuniones y estrategia', text: 'eSIM internacional y VPN dinámico para trabajar desde cualquier país sin exponer lo que llevas.' },
  { k: 'var(--zn-persona-merchant-rgb)', d: '.16s', icon: 'building-store', eyebrow: 'Comerciantes', title: 'Proveedores, precios y pagos', text: 'Tu operación diaria en apps que solo tú abres, con una app señuelo para quien insista en revisar.' }
]
</script>

<template>
<section class="sec light" id="para-quien" aria-labelledby="pq-t">
  <div class="wrap">
    <SectionHeader v-reveal class="rv" align="left" :eyebrow="t('Para quién')" :title="t('Pensado para quien no puede perder su información')" title-id="pq-t" :lead="t('Tu trabajo depende de la confianza de otros. Zi0n cuida esa confianza en el mismo celular que ya usas.')" />
    <div class="bento">
      <Card v-reveal variant="light" class="pcard big rv" style="--k:var(--zn-persona-lawyer-rgb)">
        <div class="ptag"><span class="tile ico"><Icon name="scale" /></span><span class="eyebrow">{{ t('Abogados') }}</span></div>
        <h3 class="h4">{{ t('Expedientes y conversaciones con clientes') }}</h3>
        <p class="body">{{ t('El secreto profesional también vive en tu celular. Guarda documentos y chats en la capa oculta y, si pierdes el teléfono, el borrado actúa antes de que alguien los vea.') }}</p>
        <div ref="flowEl" class="mflow" id="mflow" :aria-label="t('Ejemplo: teléfono perdido, sin PIN a tiempo, capa oculta borrada')">
          <template v-for="(s, k) in flow" :key="k"><span class="st" :class="{ act: step === k }"><i :style="{ '--c': s.c }"></i>{{ t(s.label) }}</span><span v-if="k < 2" class="ar">→</span></template>
        </div>
      </Card>
      <Card v-reveal variant="light" class="pcard rv" style="--d:.08s;--k:var(--zn-gift-rgb)">
        <div class="ptag"><span class="tile ico"><Icon name="calculator" /></span><span class="eyebrow">{{ t('Contadores') }}</span></div>
        <h3 class="h5">{{ t('Datos financieros de terceros') }}</h3>
        <p class="small">{{ t('Balances, accesos a portales y archivos de clientes, fuera de la vista de quien revise tu teléfono.') }}</p>
      </Card>
      <div ref="row" class="brow" :role="carousel ? 'region' : undefined" :aria-label="carousel ? t('Más perfiles') : undefined" :tabindex="carousel ? 0 : undefined" @scroll.passive="onScroll">
        <Card v-for="c in row3" :key="c.eyebrow" v-reveal variant="light" class="pcard rv" :style="(c.d ? '--d:' + c.d + ';' : '') + '--k:' + c.k">
          <div class="ptag"><span class="tile ico"><Icon :name="c.icon" /></span><span class="eyebrow">{{ t(c.eyebrow) }}</span></div>
          <h3 class="h5">{{ t(c.title) }}</h3>
          <p class="small">{{ t(c.text) }}</p>
        </Card>
      </div>
      <div class="dots m-only" id="bdots" aria-hidden="true"><i v-for="k in 3" :key="k" :class="{ on: active === k - 1 }"></i></div>
      <CalloutCard v-reveal class="other rv" icon="users" :title="t('¿Tu caso es otro?')" :text="t('Médicos, consultores, activistas o familias: si tu información importa, Zi0n está pensado para ti.')">
          <Button to="#faq" size="md" variant="ghost">{{ t('Hablar con un asesor') }}</Button>
          <Button to="/compra?tipo=prueba" size="md" variant="primary">{{ t('Probar 15 días') }}</Button>
      </CalloutCard>
    </div>
  </div>
</section>
</template>

<style scoped>
.bento{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:var(--zn-space-20)}
.brow{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--zn-space-20)}
.pcard{display:flex;flex-direction:column;gap:var(--zn-space-12);padding:var(--zn-space-28)}
.pcard:hover{transform:translateY(-4px);border-color:rgba(var(--k),.4);box-shadow:0 22px 40px -20px rgba(var(--k),.45)}
.pcard .ptag{display:flex;align-items:center;gap:var(--zn-space-12);margin-bottom:var(--zn-space-8)}
.tile{width:44px;height:44px;padding:11px;border-radius:var(--zn-radius-12);background:rgba(var(--k),.12);color:rgb(var(--k));flex:none;transition:transform var(--zn-dur-400) var(--ease)}
.pcard:hover .tile{transform:rotate(-6deg) scale(1.06)}
.pcard.big .tile{width:56px;height:56px;padding:14px}
.mflow{display:flex;align-items:center;flex-wrap:wrap;gap:var(--zn-space-8);margin-top:auto;padding-top:var(--zn-space-12)}
.mflow .st{display:inline-flex;align-items:center;gap:var(--zn-space-8);padding:var(--zn-space-7) var(--zn-space-12);border-radius:var(--radius-pill);background:var(--zn-light-chip);font:var(--zn-weight-regular) 12px/16px var(--font-sans);color:var(--color-light-text);transition:background var(--zn-dur-400),color var(--zn-dur-400),box-shadow var(--zn-dur-400)}
.mflow .st i{width:7px;height:7px;border-radius:50%;background:var(--c)}
.mflow .st.act{background:var(--color-navy);color:var(--color-white);box-shadow:0 6px 18px -6px rgba(var(--rgb-navy),.6)}
.mflow .ar{font:var(--zn-weight-regular) 12px/16px var(--font-sans);color:var(--ui-muted)} /* AA: muted daba 2.87:1 sobre blanco */
.other{grid-column:1/-1}
.dots{display:flex;gap:var(--zn-space-6);justify-content:center}
.dots i{width:6px;height:6px;border-radius:3px;background:var(--zn-light-dot);transition:width var(--dur-medium) var(--ease),background var(--dur-medium)}
.dots i.on{width:22px;background:var(--color-navy)}

@media (max-width:1180px){
  .bento{grid-template-columns:minmax(0,1fr) 320px}
}
@media (max-width:1023px){
  .bento{grid-template-columns:1fr}
}
@media (max-width:640px){
  .bento{gap:var(--zn-space-14)}
  .pcard{padding:var(--zn-space-24) var(--zn-space-22)}
  .brow{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--pad);gap:var(--zn-space-12);margin:0 calc(var(--pad) * -1);padding:var(--zn-space-4) var(--pad) var(--zn-space-12);scrollbar-width:none}
  .brow::-webkit-scrollbar{display:none}
  .brow:focus-visible{outline-offset:-2px}
  .brow::after{content:"";flex:0 0 1px}
  .brow>.pcard{flex:0 0 272px;scroll-snap-align:start}
  .dots.m-only{display:flex!important}
}
@media (hover:none){.pcard:hover{transform:none}}
</style>
