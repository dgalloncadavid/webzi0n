<script setup>
/* GrapheneOS · capa Zi0n: carrusel a sangre con flechas, teclado, arrastre con mouse
   y barra de progreso. */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const slides = [
  { cls: 'c-aur', rgb: 'var(--rgb-aurora)', icon: 'lock', title: 'Un entorno cerrado', text: 'Solo apps de la tienda de Zi0n. Sin redes sociales ni juegos por defecto.', n: '01' },
  { cls: 'c-sig', rgb: 'var(--rgb-signal)', icon: 'history', title: 'Datos que no se acumulan', text: 'Cada 15 minutos limpia cachés, fotos, archivos e historial.', n: '02' },
  { cls: 'c-alt', rgb: 'var(--rgb-alert)', icon: 'trash', title: 'Más formas de borrar', text: 'Cable, SIM, señal o botón de volumen. Siempre con alerta antes.', n: '03' },
  { cls: 'c-ice', rgb: 'var(--rgb-ice)', icon: 'eye-off', title: 'Una capa que nadie ve', text: 'Quien desbloquea el teléfono ve un celular común.', n: '04' }
]

const car = ref(null)
const fill = ref(null)
const prevOff = ref(true)
const nextOff = ref(false)
const fillW = ref('300px')
const MQ = window.matchMedia('(max-width:1023px)')
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const STEP = () => { const s = car.value.children; return s[1].offsetLeft - s[0].offsetLeft }

function update() {
  const c = car.value
  const max = c.scrollWidth - c.clientWidth
  const s = c.scrollLeft
  prevOff.value = s < 4
  nextOff.value = s >= max - 4
  const tw = fill.value.parentNode.offsetWidth
  const b0 = MQ.matches ? Math.max(0.25, c.clientWidth / c.scrollWidth) * tw : 300
  fillW.value = (max <= 4 ? tw : b0 + clamp(s / max, 0, 1) * (tw - b0)) + 'px'
}
const by = (d) => car.value.scrollBy({ left: d * STEP(), behavior: 'smooth' })
function onKey(e) {
  if (e.key === 'ArrowRight') { by(1); e.preventDefault() }
  if (e.key === 'ArrowLeft') { by(-1); e.preventDefault() }
}
/* arrastre con mouse */
let down = false, sx = 0, sl = 0
const dragging = ref(false)
function pDown(e) { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = car.value.scrollLeft; dragging.value = true; car.value.setPointerCapture(e.pointerId) }
function pMove(e) { if (down) car.value.scrollLeft = sl - (e.clientX - sx) }
function pEnd() { if (!down) return; down = false; dragging.value = false; const k = Math.round(car.value.scrollLeft / STEP()); car.value.scrollTo({ left: k * STEP(), behavior: 'smooth' }) }

onMounted(() => { update(); window.addEventListener('resize', update) })
onBeforeUnmount(() => window.removeEventListener('resize', update))
</script>

<template>
<section class="sec s03" id="capa" :aria-label="t('Capa Zi0n')">
  <div class="frame" style="height:701px">
    <div class="dec" style="left:-600px;right:-600px">
      <span class="glow" style="left:300px;top:200px;width:800px;height:800px;--rgb:var(--rgb-aurora);--a:.26"></span>
    </div>
    <h2 v-reveal class="h2 abs rv" style="left:80px;top:96px;width:623px">{{ t('Lo que Zi0n hace cuando te equivocas') }}</h2>
    <button class="nb prev" id="prev" type="button" :aria-label="t('Anterior')" style="left:1104px;top:88px" :disabled="prevOff" @click="by(-1)"><span class="ico"><Icon name="chevron-left" /></span></button>
    <button class="nb next" id="next" type="button" :aria-label="t('Siguiente')" style="left:1168px;top:88px" :disabled="nextOff" @click="by(1)"><span class="ico"><Icon name="chevron-right" /></span></button>
    <div class="ptrack" style="left:80px;top:188px"><i ref="fill" class="pfill" id="pfill" :style="{ width: fillW }"></i></div>

  </div>

  <!-- carrusel a sangre: ocupa todo el ancho de la pantalla -->
  <div ref="car" class="car" :class="{ dragging }" id="car" tabindex="0" :aria-label="t('Carrusel de funciones')" @scroll.passive="update" @keydown="onKey" @pointerdown="pDown" @pointermove="pMove" @pointerup="pEnd" @pointercancel="pEnd">
    <article v-for="s in slides" :key="s.n" class="slide" :class="s.cls" :style="'--rgb:' + s.rgb">
      <span class="sg"></span><span class="sr r1"></span><span class="sr r2"></span>
      <div class="sb"><span class="ico"><Icon :name="s.icon" /></span></div>
      <h3 class="h3">{{ t(s.title) }}</h3>
      <p class="body">{{ t(s.text) }}</p>
      <span class="mono sn">{{ s.n }}</span>
    </article>
  </div>
</section>
</template>

<style scoped>
.nb{position:absolute;width:52px;height:52px;border-radius:var(--radius-round);display:grid;place-items:center;background:var(--color-ink);border:1px solid rgba(var(--rgb-ice),.4);transition:transform var(--dur-base) var(--ease),opacity var(--dur-base),background var(--dur-base),border-color var(--dur-base)}
.nb .ico{width:24px;height:24px;color:var(--color-ice)}
.nb .ic{stroke-width:2}
.nb.next{background:var(--color-signal);border-color:var(--color-signal)}
.nb.next .ico{color:var(--color-ink)}
.nb:hover{transform:scale(1.08)}
.nb[disabled]{opacity:.35;pointer-events:none}
.nb.next[disabled]{opacity:.45}
.ptrack{position:absolute;width:1120px;height:3px;background:rgba(var(--rgb-ice),.15);border-radius:3px}
.pfill{position:absolute;left:0;top:0;height:3px;width:300px;border-radius:3px;background:linear-gradient(90deg,var(--color-signal),var(--color-aurora));box-shadow:0 0 8px rgba(var(--rgb-signal),.8);transition:width var(--zn-dur-500) var(--ease)}
.car{position:absolute;left:0;top:219px;width:var(--vw);height:410px;align-items:flex-start;padding-top:16px!important;display:flex;gap:var(--zn-space-24);padding:0 calc(var(--gut) + 80px);overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-padding-left:calc(var(--gut) + 80px);scrollbar-width:none;cursor:grab}
.car::-webkit-scrollbar{display:none}
.car::after{content:"";flex:0 0 1px}
.car.dragging{scroll-snap-type:none;cursor:grabbing;user-select:none}
.slide{position:relative;flex:0 0 420px;height:370px;scroll-snap-align:start;border-radius:var(--zn-radius-32);border:1px solid rgba(var(--rgb),.5);overflow:hidden;background:linear-gradient(153deg,rgba(var(--rgb),.28) 13.4%,var(--color-ink) 86.6%);transition:transform var(--zn-dur-500) var(--ease)}
.slide:hover{transform:translateY(-6px)}
.sg{position:absolute;left:-61px;top:-161px;width:540px;height:540px;border-radius:var(--radius-round);background:radial-gradient(closest-side,rgba(var(--rgb),.5),rgba(var(--rgb),.14) 60%,rgba(var(--rgb),0))}
.sr{position:absolute;border-radius:var(--radius-round);border:1px solid rgba(var(--rgb),.3);animation:ringp 5s var(--zn-ease-in-out) infinite}
.sr.r1{left:104px;top:4px;width:210px;height:210px}
.sr.r2{left:59px;top:-41px;width:300px;height:300px;border-color:rgba(var(--rgb),.16);animation-delay:-1.6s}
@keyframes ringp{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:.55}}
.sb{position:absolute;left:157px;top:57px;width:104px;height:104px;border-radius:var(--radius-round);background:var(--color-ink);border:1.5px solid rgb(var(--rgb));box-shadow:0 0 28px rgba(var(--rgb),.7);display:grid;place-items:center}
.sb .ico{width:40px;height:40px;color:rgb(var(--rgb))}
.slide .h3{position:absolute;left:31px;top:221px;width:360px}
.slide .body{position:absolute;left:31px;top:277px;width:350px}
.slide .sn{position:absolute;left:357px;top:27px;color:rgb(var(--rgb))}
/* AA: aurora sobre su propio brillo daba 3.16:1 */
.slide.c-aur .sn{color:var(--zn-aurora-on-glow)}

/* cabecera y carrusel a sangre */
.s03 .frame{width:var(--vw)}
.s03 .ptrack{width:calc(var(--vw) - 160px)}
.s03 .nb.prev{left:auto!important;right:144px}
.s03 .nb.next{left:auto!important;right:80px}
.car{padding:16px calc(80px * var(--z)) 0;scroll-padding-left:calc(80px * var(--z))}
.car::after{display:none}
.slide{flex-basis:max(420px,calc((var(--vw) - 232px) / 4))}
.slide .sg{left:calc(50% - 271px)}.slide .sr.r1{left:calc(50% - 106px)}.slide .sr.r2{left:calc(50% - 151px)}.slide .sb{left:calc(50% - 53px)}.slide .sn{left:auto;right:45px}

@media (max-width:1023px){
  .s03 .nb{display:none}
  .s03 .ptrack{margin-bottom:8px}
  .s03>.frame{padding-bottom:24px!important}
  .s03 .car{position:relative!important;top:auto!important;left:auto!important;margin:0 0 64px;height:auto!important;width:auto!important;max-width:none!important;padding:16px var(--pad) 8px!important;scroll-padding-left:var(--pad)!important;gap:var(--zn-space-14)}
  .car::after{display:block;content:"";flex:0 0 6px}
  .slide{flex:0 0 min(340px,calc(100vw - 56px))!important;height:380px;display:flex;flex-direction:column;justify-content:flex-end;padding:0 24px 28px}
  .slide .h3,.slide .body{position:relative;left:auto;top:auto;width:auto}
  .slide .body{margin-top:10px}
  .slide .sn{right:24px;top:24px}
  .slide:hover{transform:none}
  .nb{touch-action:manipulation}
}
@media (min-width:600px) and (max-width:1023px){
  .s03 .nb{display:none}
}
@media (max-width:1023px){
  .s03>.frame{padding-bottom:20px!important}
  .s03 .car{margin-bottom:48px}
}
</style>
