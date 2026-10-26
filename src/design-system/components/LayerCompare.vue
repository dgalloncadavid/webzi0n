<script setup>
/* Comparador de capas sobre un teléfono: una línea diagonal separa la capa visible
   de la oculta. Se arrastra con el puntero o con las flechas, Inicio y Fin.
   Al entrar en pantalla hace un barrido de presentación que muestra las dos capas.
   variant: cripto | graphene (cada landing tiene su propia geometría, tomada del Figma).
   Slots: back (aurora y anillos detrás del teléfono), default (chips y burbujas).
   Superficie fija: oscura (manija tinta con signal); el anillo de foco toma el color del contenedor. */
import { ref, reactive, computed, onMounted, onBeforeUnmount, unref } from 'vue'
import Icon from './Icon.vue'
import { prefersReducedMotion } from '../composables/useMedia'

const props = defineProps({
  variant: { type: String, default: 'cripto' },
  base: { type: Object, required: true },
  visible: { type: Object, required: true },
  ariaLabel: { type: String, default: '' },
  handleLabel: { type: String, default: '' },
  /** elemento (o ref) que mueve el fondo con parallax al pasar el puntero */
  parallaxArea: { type: [Object, Function], default: null }
})

const GEOMETRY = {
  graphene: { W: 541.2, Y0: 231.4, YH: 267.3, PX: 8.2, PY: 41, PH: 521.52, MIN: 70, MAX: 450, X: 254.2, HALF: 287, DV: 1.23, DG: 7.38, HR: 20.48, threshold: 0.5, kf: [[0, 254.2], [0.28, 120], [0.62, 440], [1, 254.2]] },
  cripto: { W: 568, Y0: 229.7, YH: 270.7, PX: -6, PY: 12, PH: 596, MIN: 80, MAX: 470, X: 284, HALF: 328, DV: 1.25, DG: 7.5, HR: 23, threshold: 0.4, kf: [[0, 284], [0.28, 140], [0.62, 450], [1, 284]] }
}
const G = computed(() => GEOMETRY[props.variant])
const TAN = Math.tan(27.61 * Math.PI / 180)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const reduce = prefersReducedMotion()

const hv = ref(null)
const par = ref(null)
const drag = ref(false)
const touched = ref(false)
const st = reactive({ xh: 0, dv: '', dg: '', hd: '', clip: '', now: 50 })

function set(v) {
  const g = G.value
  const xh = clamp(v, g.MIN, g.MAX)
  st.xh = xh
  const x0 = xh + (g.YH - g.Y0) * TAN
  st.dv = 'translate(' + (x0 - g.DV) + 'px,' + (g.Y0 - g.HALF) + 'px) rotate(27.61deg)'
  st.dg = 'translate(' + (x0 - g.DG) + 'px,' + (g.Y0 - g.HALF) + 'px) rotate(27.61deg)'
  st.hd = 'translate(' + (xh - g.HR) + 'px,' + (g.YH - g.HR) + 'px)'
  const xt = x0 + (g.Y0 - g.PY) * TAN - g.PX
  const xb = x0 - (g.PY + g.PH - g.Y0) * TAN - g.PX
  st.clip = 'polygon(0 0,' + xt + 'px 0,' + xb + 'px ' + g.PH + 'px,0 ' + g.PH + 'px)'
  st.now = Math.round((xh - g.MIN) / (g.MAX - g.MIN) * 100)
}
let raf = 0
function stop() { touched.value = true; cancelAnimationFrame(raf) }
function toLocal(ev) { const r = hv.value.getBoundingClientRect(); return (ev.clientX - r.left) / (r.width / G.value.W) }
function down(ev) {
  if (ev.button > 0) return
  stop(); drag.value = true
  try { hv.value.setPointerCapture(ev.pointerId) } catch (e) { /* sin captura */ }
  set(toLocal(ev))
}
function move(ev) { if (drag.value) set(toLocal(ev)) }
function up() { drag.value = false }
function key(ev) {
  const g = G.value
  let d = 0
  if (ev.key === 'ArrowLeft') d = -24
  if (ev.key === 'ArrowRight') d = 24
  if (ev.key === 'Home') { stop(); set(g.MIN); ev.preventDefault(); return }
  if (ev.key === 'End') { stop(); set(g.MAX); ev.preventDefault(); return }
  if (d) { stop(); set(st.xh + d); ev.preventDefault() }
}

/* barrido de presentación */
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
function intro() {
  if (reduce || touched.value) return
  const kf = G.value.kf
  const T = 3800
  const t0 = performance.now()
  const step = (now) => {
    if (touched.value) return
    const p = clamp((now - t0) / T, 0, 1)
    let i = 1
    while (i < kf.length - 1 && p > kf[i][0]) i++
    const a = kf[i - 1], b = kf[i]
    set(a[1] + (b[1] - a[1]) * ease(clamp((p - a[0]) / (b[0] - a[0]), 0, 1)))
    if (p < 1) raf = requestAnimationFrame(step)
  }
  step(t0)
}

/* parallax suave del fondo */
let area = null
function onArea(ev) {
  const r = area.getBoundingClientRect()
  const x = (ev.clientX - r.left) / r.width - 0.5
  const y = (ev.clientY - r.top) / r.height - 0.5
  par.value.style.transform = 'translate(' + (x * -16).toFixed(1) + 'px,' + (y * -12).toFixed(1) + 'px)'
}

let io = null
let introTimer = null
set(GEOMETRY[props.variant].X)
onMounted(() => {
  io = new IntersectionObserver((es) => {
    if (es[0].isIntersecting) { introTimer = setTimeout(intro, 700); io.disconnect() }
  }, { threshold: G.value.threshold })
  io.observe(hv.value)
  const a = typeof props.parallaxArea === 'function' ? props.parallaxArea() : unref(props.parallaxArea)
  area = a && a.$el ? a.$el : a
  if (!reduce && area) area.addEventListener('pointermove', onArea)
})
onBeforeUnmount(() => {
  if (io) io.disconnect()
  clearTimeout(introTimer)
  cancelAnimationFrame(raf)
  if (area) area.removeEventListener('pointermove', onArea)
})
</script>

<template>
<div ref="hv" class="hv" :class="['hv--' + variant, { drag, touched }]" id="hv" data-theme="dark" role="group" :aria-label="ariaLabel" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up">
  <div ref="par" class="par"><slot name="back" /></div>
  <div class="phone" id="phone"><img class="ph-base" :src="base.src" :width="base.width" :height="base.height" :alt="base.alt" draggable="false"><img class="ph-vis" id="vis" :src="visible.src" :width="visible.width" :height="visible.height" :alt="visible.alt" draggable="false" :style="{ clipPath: st.clip }"></div>
  <span class="divider" id="divider" :style="{ transform: st.dv }"></span>
  <span class="divider-glow" id="dglow" :style="{ transform: st.dg }"></span>
  <slot />
  <button class="handle" id="handle" type="button" role="slider" :aria-label="handleLabel" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="st.now" :style="{ transform: st.hd }" @keydown="key"><span class="ico"><Icon name="arrows-exchange" /></span></button>
</div>
</template>

<style scoped>
.hv{--ui-focus:inherit;position:relative;flex:none;touch-action:pan-y;cursor:ew-resize;-webkit-user-select:none;user-select:none}
.par{position:absolute;inset:0;transition:transform var(--zn-dur-500) var(--ease)}
.phone{position:absolute}
.phone img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none}
.divider,.divider-glow{position:absolute;left:0;top:0;background:var(--color-signal);pointer-events:none;will-change:transform}
.handle{position:absolute;left:0;top:0;z-index:3;border-radius:var(--radius-round);background:var(--color-ink);display:grid;place-items:center;cursor:grab;transition:box-shadow var(--dur-base),scale var(--dur-base)}
.handle .ico{color:var(--color-signal)}
.handle .ic{stroke-width:2}
.handle::before{content:"";position:absolute;inset:-8px;border-radius:var(--radius-round);border:1px solid var(--color-signal);opacity:0;animation:pulse var(--zn-dur-2400) var(--zn-ease-out) infinite}
.hv.drag .handle{cursor:grabbing;scale:1.12}
.hv.touched .handle::before{animation:none}
@keyframes pulse{0%{transform:scale(.8);opacity:.7}100%{transform:scale(1.7);opacity:0}}

/* GrapheneOS: medidas del Figma escaladas a 0,82 */
.hv--graphene{width:541.2px;height:598.6px}
.hv--graphene .phone{left:8.2px;top:41px;width:524.8px;height:521.52px;transition:transform var(--zn-dur-500) var(--ease)}
.hv--graphene .ph-base{filter:drop-shadow(0 27.88px 32.8px rgba(var(--rgb-signal),.25))}
.hv--graphene .divider,.hv--graphene .divider-glow{transform-origin:50% 50%}
.hv--graphene .divider{width:2.46px;height:574px}
.hv--graphene .divider-glow{width:14.76px;height:574px;filter:blur(var(--zn-blur-5-74));opacity:.9}
.hv--graphene .handle{width:40.96px;height:40.96px;border:1.64px solid var(--color-signal);box-shadow:0 0 21.32px rgba(var(--rgb-signal),.55)}
.hv--graphene .handle .ico{width:19.68px;height:19.68px}
.hv--graphene.drag .handle{box-shadow:0 0 30px rgba(var(--rgb-signal),.8)}

/* Cripto */
.hv--cripto{position:absolute;left:0;top:0;width:568px;height:620px;transform:scale(var(--hs));transform-origin:0 0}
.hv--cripto .phone{left:-6px;top:12px;width:600px;height:596px;animation:floatp 7s var(--zn-ease-in-out) infinite}
.hv--cripto .ph-base{filter:drop-shadow(0 30px 40px rgba(var(--rgb-signal),.22))}
.hv--cripto .divider{width:2.5px;height:656px}
.hv--cripto .divider-glow{width:15px;height:656px;filter:blur(var(--zn-blur-6));opacity:.9}
.hv--cripto .handle{width:46px;height:46px;border:1.8px solid var(--color-signal);box-shadow:0 0 24px rgba(var(--rgb-signal),.55)}
.hv--cripto .handle .ico{width:22px;height:22px}
.hv--cripto.drag .handle{box-shadow:0 0 32px rgba(var(--rgb-signal),.8)}
@keyframes floatp{0%,100%{translate:0 0}50%{translate:0 -6px}}

@media (max-width:1023px){
  .hv--graphene{position:absolute;left:0;top:0;transform:scale(var(--hs,1));transform-origin:0 0}
}
</style>
