<script setup>
/* Cripto · funciones: tarjetas con spotlight y revelado escalonado por fila. */
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import Card from '@/design-system/components/Card.vue'
import Badge from '@/design-system/components/Badge.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'
import { prefersReducedMotion } from '@/design-system/composables/useMedia'

const { t } = useT()
const reduce = prefersReducedMotion()
const feats = [
  ['plug-connected', 'Borrado por cable', 'Si alguien conecta un cable, el teléfono suena, vibra y te pide tu PIN. Si no lo ingresas, el sistema se elimina.', true],
  ['bolt', 'Borrado inmediato', 'Un PIN específico elimina todo el sistema al instante.', true],
  ['password', 'PIN bajo presión', 'Un PIN adicional en la pantalla de bloqueo elimina el sistema en segundos.', true],
  ['device-sim', 'Cambio de SIM', 'Un cambio de SIM o eSIM no autorizado pide tu PIN. Si no lo ingresas, el sistema se elimina.', true],
  ['antenna-bars-off', 'Sin señal', 'Si el dispositivo pasa demasiado tiempo sin señal, el sistema se elimina.', true],
  ['hourglass', 'Temporizador', 'Define cuánto tiempo sin uso es demasiado y el sistema se destruye solo.', true],
  ['alert-octagon', 'Botón de pánico', 'Una combinación de botones físicos elimina el sistema por completo.', true],
  ['camera-off', 'Cámara y micrófono', 'Desactívalos cuando quieras.'],
  ['screenshot', 'Bloqueo de capturas', 'Sin capturas ni grabaciones de pantalla.'],
  ['notes', 'Notas encriptadas', 'Apuntes cifrados de extremo a extremo.'],
  ['world', 'VPN dinámico', 'Tu dirección IP rota constantemente sobre una red descentralizada.'],
  ['world-pin', 'eSIM internacional', 'Conexión estable en cualquier país, con múltiples operadores.']
]
/* retraso por posición: columna * 0,08 s + fila * 0,04 s */
const fd = (i) => ((i % 3) * 0.08 + Math.floor(i / 3) * 0.04) + 's'
function spot(e) {
  if (reduce) return
  const c = e.currentTarget
  const r = c.getBoundingClientRect()
  c.style.setProperty('--mx', (e.clientX - r.left) + 'px')
  c.style.setProperty('--my', (e.clientY - r.top) + 'px')
}
</script>

<template>
<section class="sec" id="funciones" :aria-label="t('Funciones')">
  <div class="glowbg" style="--rgb:var(--rgb-signal);left:30%;top:30%"></div>
  <div class="wrap">
    <SectionHeader v-reveal class="rv" :eyebrow="t('Funciones')" :title="t('Qué incluye Zi0n')" />
    <div class="grid3 feats" id="feats">
      <Card v-for="(f, i) in feats" :key="f[1]" v-reveal class="feat" :style="'--fd:' + fd(i)" @pointermove="spot"><div class="fhead"><span class="ibadge c-aur"><span class="ico"><Icon :name="f[0]" /></span></span><Badge v-if="f[3]" variant="strong" tone="alert">{{ t('Se borra') }}</Badge></div><h3 class="h5">{{ t(f[1]) }}</h3><p class="small">{{ t(f[2]) }}</p></Card>
    </div>
  </div>
</section>
</template>

<style scoped>
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--zn-space-24)}
.ibadge{width:40px;height:40px;border-radius:var(--radius-round);display:grid;place-items:center;background:rgba(var(--rgb),.16);color:rgb(var(--rgb));flex:none;transition:transform var(--zn-dur-400) var(--ease),box-shadow var(--zn-dur-400)}
.ibadge .ico{width:22px;height:22px}
.card:hover .ibadge{transform:scale(1.08) rotate(-4deg);box-shadow:0 0 20px rgba(var(--rgb),.45)}
.feat{display:flex;flex-direction:column;gap:var(--zn-space-16);overflow:hidden;--mx:50%;--my:0%}
.feat::after{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(280px circle at var(--mx) var(--my),rgba(var(--rgb-aurora),.16),transparent 60%);opacity:0;transition:opacity var(--dur-medium);pointer-events:none}
.feat:hover::after{opacity:1}
.fhead{display:flex;align-items:center;justify-content:space-between}
/* .grid3 .feat iguala la prioridad que tenía .js .feat frente a .card:hover en el original */
.grid3 .feat{opacity:0;transform:translateY(20px);transition:opacity var(--zn-dur-700) var(--ease) var(--fd,0s),transform var(--zn-dur-700) var(--ease) var(--fd,0s),border-color var(--dur-medium),box-shadow var(--dur-medium)}
.grid3 .feat.in{opacity:1;transform:none}
.grid3 .feat.in:hover{transform:translateY(-4px);transition-delay:0s}
@media (max-width:1023px){
  .grid3{grid-template-columns:1fr;max-width:560px;margin:0 auto}
}
@media (max-width:640px){
  .grid3.feats{gap:var(--zn-space-12)}
  .feat{padding:var(--zn-space-18);gap:var(--zn-space-10)}
}
@media (prefers-reduced-motion:reduce){
  .grid3 .feat{opacity:1;transform:none}
}
</style>
