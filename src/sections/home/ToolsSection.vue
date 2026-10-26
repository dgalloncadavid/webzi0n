<script setup>
/* Inicio · herramientas: recorrido automático por los ítems mientras la sección se ve;
   al pasar el puntero se pausa. */
import { asset } from '@/design-system/asset'
import { ref, computed, onBeforeUnmount } from 'vue'
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import Badge from '@/design-system/components/Badge.vue'
import ToolItem from '@/design-system/components/ToolItem.vue'
import PhoneVisual from '@/design-system/components/PhoneVisual.vue'
import { useT } from '@/design-system/composables/useLang'
import { useInView } from '@/design-system/composables/useInView'
import { prefersReducedMotion } from '@/design-system/composables/useMedia'

const { t } = useT()
const groups = [
  { tone: 'c-alt', badge: 'alert', label: 'Borrado automático', items: [
    ['plug-connected', 'Cable conectado', 'Pide tu PIN si alguien conecta un cable'],
    ['device-sim', 'Cambio de SIM o eSIM', 'Reacciona si cambian tu línea'],
    ['antenna-bars-off', 'Sin señal', 'Cuenta el tiempo sin red'],
    ['hourglass', 'Temporizador', 'Defines cuántos días sin uso'],
    ['password', 'PIN de pánico', 'Un PIN que borra al ingresarlo'],
    ['volume', '5 pulsaciones de volumen', 'Borrado de emergencia al instante']
  ] },
  { tone: 'c-aur', badge: 'aurora', label: 'Privacidad diaria', items: [
    ['square-circle', 'App señuelo', 'Una fachada creíble para quien revise'],
    ['screenshot', 'Bloqueo de capturas', 'Nadie toma pantallazos de tu capa'],
    ['camera-off', 'Cámara y micrófono', 'Apágalos con un toque'],
    ['notes', 'Notas encriptadas', 'Lo que escribes queda en la capa oculta']
  ] },
  { tone: 'c-sig', badge: 'signal', label: 'Conexión', items: [
    ['world', 'VPN dinámico', 'Cambia tu salida de red'],
    ['world-pin', 'eSIM internacional', 'Datos móviles en varios países'],
    ['apps', 'Tienda de Zi0n', 'Apps revisadas para la capa oculta']
  ] }
]
/* índice global de cada ítem para el recorrido */
const indexed = computed(() => {
  let n = 0
  return groups.map((g) => g.items.map(() => n++))
})
const total = groups.reduce((s, g) => s + g.items.length, 0)

const sec = ref(null)
const act = ref(-1)
let i = -1
let tm = null
let hover = false
function go() {
  if (hover) return
  i = (i + 1) % total
  act.value = i
}
function enter() { hover = true; act.value = -1 }
function leave() { hover = false }
if (!prefersReducedMotion()) {
  useInView(sec, {
    threshold: 0.2,
    onChange(on) {
      if (on && !tm) { go(); tm = setInterval(go, 1500) }
      else if (!on) { clearInterval(tm); tm = null }
    }
  })
}
onBeforeUnmount(() => clearInterval(tm))
</script>

<template>
<section ref="sec" class="sec" id="herramientas" aria-labelledby="h-t">
  <span class="glowbg c-aur" style="left:-260px;top:120px"></span>
  <div class="wrap tools">
    <PhoneVisual v-reveal class="rv" :src="asset('assets/home/phone-apps.png')" width="525" height="1087" :alt="t('Capa oculta de Zi0n con apps de wallets, mensajería y precios del mercado')" tone="aurora" />
    <div class="tcont">
      <SectionHeader v-reveal class="rv" align="left" :eyebrow="t('Herramientas')" :title="t('Todo lo que necesitas, nada que sobre')" title-id="h-t" :lead="t('Herramientas que ya vienen en Zi0n y que configuras una sola vez desde la app.')" />
      <div v-for="(g, gi) in groups" :key="g.label" v-reveal class="tgroup rv" :class="g.tone">
        <Badge variant="outline" :tone="g.badge">{{ t(g.label) }}</Badge>
        <ul class="titems">
          <ToolItem v-for="(it, k) in g.items" :key="it[1]" :icon="it[0]" :title="t(it[1])" :text="t(it[2])" :active="act === indexed[gi][k]" @pointerenter="enter" @pointerleave="leave" />
        </ul>
      </div>
    </div>
  </div>
</section>
</template>

<style scoped>
.tools{display:grid;grid-template-columns:360px minmax(0,1fr);gap:var(--zn-space-48);align-items:center}
.tcont{display:flex;flex-direction:column;gap:var(--zn-space-32)}
.tcont .shead{margin-bottom:0}
.tgroup{display:flex;flex-direction:column;gap:var(--zn-space-16)}
.titems{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--zn-space-12)}

@media (max-width:1180px){
  .tools{grid-template-columns:300px minmax(0,1fr);gap:var(--zn-space-40)}
  .tvis{--phone-w:280px}
}
@media (max-width:1023px){
  .tools{grid-template-columns:1fr;gap:var(--zn-space-48)}
  .tvis{order:2}
}
@media (max-width:640px){
  .tcont{gap:var(--zn-space-28)}
  .titems{grid-template-columns:1fr;gap:var(--zn-space-10)}
  .tvis{--phone-w:270px}
}
</style>
