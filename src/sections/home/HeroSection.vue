<script setup>
/* Inicio · hero: el visual escala para caber, parallax con el puntero
   y alerta intermitente en el chip del cable. */
import { asset } from '@/design-system/asset'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Button from '@/design-system/components/Button.vue'
import FloatingChip from '@/design-system/components/FloatingChip.vue'
import { useT } from '@/design-system/composables/useLang'
import { prefersReducedMotion } from '@/design-system/composables/useMedia'

const { t } = useT()
const reduce = prefersReducedMotion()
const hero = ref(null)
const box = ref(null)
const par = ref(null)
const hs = ref('1.0000')
const flash = ref(false)

const SM = window.matchMedia('(max-width:640px)')
function fit() {
  const mob = SM.matches
  const W = mob ? 350 : 500
  const H = mob ? 560 : 600
  const s = Math.min(1, box.value.clientWidth / W, mob ? 1 : box.value.clientHeight / H)
  hs.value = s.toFixed(4)
}
function onMove(ev) {
  if (ev.pointerType !== 'mouse') return
  const r = hero.value.getBoundingClientRect()
  const x = (ev.clientX - r.left) / r.width - 0.5
  const y = (ev.clientY - r.top) / r.height - 0.5
  par.value.style.transform = 'translate(' + (x * -18).toFixed(1) + 'px,' + (y * -14).toFixed(1) + 'px)'
}

let ro = null
let flashTimer = null
let flashOff = null
onMounted(() => {
  fit()
  ro = new ResizeObserver(fit)
  ro.observe(box.value)
  if (!reduce) {
    hero.value.addEventListener('pointermove', onMove)
    flashTimer = setInterval(() => {
      flash.value = true
      flashOff = setTimeout(() => { flash.value = false }, 1300)
    }, 4600)
  }
})
onBeforeUnmount(() => {
  if (ro) ro.disconnect()
  clearInterval(flashTimer)
  clearTimeout(flashOff)
  if (hero.value) hero.value.removeEventListener('pointermove', onMove)
})
</script>

<template>
<section ref="hero" class="hero" id="hero" aria-label="Zi0n">
  <div class="wrap hero-in">
    <div class="copy">
      <h1 v-reveal class="h1 rv" style="--d:.06s">{{ t('Tu Samsung, con una capa que solo tú sabes abrir.') }}</h1>
      <p v-reveal class="body-lg rv d-only" style="--d:.12s">{{ t('Zi0n separa lo que cualquiera ve de lo que solo tú abres. Si alguien conecta un cable, cambia tu SIM o fuerza tu PIN, el teléfono te avisa y, si no respondes, se borra.') }}</p>
      <p v-reveal class="body-lg rv m-only" style="--d:.12s">{{ t('Zi0n separa lo que cualquiera ve de lo que solo tú abres. Si alguien fuerza tu teléfono, te avisa y, si no respondes, se borra.') }}</p>
      <div v-reveal class="ctas rv" style="--d:.18s">
        <Button to="/compra?tipo=prueba" size="lg" variant="primary"><span class="d-only">{{ t('Probar 15 días gratis') }}</span><span class="m-only">{{ t('Probar 15 días') }}</span></Button>
        <Button to="#planes" size="lg" variant="ghost">{{ t('Ver planes') }}</Button>
      </div>
      <p v-reveal class="mono muted rv d-only" style="--d:.24s">{{ t('Instalación por QR en minutos · Sin cambiar de teléfono') }}</p>
    </div>

    <div ref="box" class="hvbox" id="hvbox" :style="{ '--hs': hs }">
      <div v-reveal class="hv" id="hv">
        <div ref="par" class="par" id="par">
          <span class="glow g1"></span><span class="glow g2"></span>
          <span class="ring r1"></span><span class="ring r2"></span><span class="ring r3"></span>
          <span class="pulse"></span>
        </div>
        <img class="hphone" :src="asset('assets/home/phone-zion.png')" width="556" height="1149" :alt="t('App de Zi0n en un Samsung: suscripción, eSIM, app señuelo y preferencias de seguridad')" draggable="false">
        <FloatingChip class="c1" tone="signal">{{ t('App señuelo · activa') }}</FloatingChip>
        <FloatingChip class="c2 chip-alert" :class="{ flash }" id="chipCable" tone="alert">{{ t('Cable detectado · pide PIN') }}</FloatingChip>
        <FloatingChip class="c3" tone="alert">{{ t('Borrado de emergencia · listo') }}</FloatingChip>
        <FloatingChip class="c4" tone="aurora">{{ t('VPN dinámico · on') }}</FloatingChip>
      </div>
    </div>
  </div>
</section>
</template>

<style scoped>
.hero{position:relative;overflow:hidden;height:720px}
.hero-in{display:grid;grid-template-columns:minmax(0,580px) minmax(0,1fr);align-items:center;gap:var(--zn-space-48);height:100%}
.copy{display:flex;flex-direction:column;gap:var(--zn-space-24)}
.copy .body-lg{max-width:540px}
.ctas{display:flex;gap:var(--zn-space-16);flex-wrap:wrap}
.hvbox{position:relative;height:600px;display:flex;justify-content:center}
.hv{position:relative;width:500px;height:600px;flex:none;transform:scale(var(--hs));transform-origin:50% 50%}
.par{position:absolute;inset:0;transition:transform var(--zn-dur-600) var(--ease)}
.glow{position:absolute;border-radius:var(--radius-round);pointer-events:none}
.g1{left:-40px;top:20px;width:560px;height:560px;background:radial-gradient(closest-side,rgba(var(--rgb-signal),.26),rgba(var(--rgb-signal),0));animation:drift1 12s var(--zn-ease-in-out) infinite}
.g2{left:190px;top:280px;width:420px;height:420px;background:radial-gradient(closest-side,rgba(var(--rgb-aurora),.36),rgba(var(--rgb-aurora),0));animation:drift2 14s var(--zn-ease-in-out) infinite}
@keyframes drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(120px,60px)}}
@keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-120px,-50px)}}
.ring{left:50%;top:50%;transform:translate(-50%,-50%)}
.r1{width:300px;height:300px;--a:.18}.r2{width:420px;height:420px;--a:.11}.r3{width:540px;height:540px;--a:.06}
.pulse{position:absolute;left:50%;top:50%;width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:var(--radius-round);border:1px solid rgba(var(--rgb-signal),.5);opacity:0;animation:ripple 4.2s var(--ease) infinite}
@keyframes ripple{0%{transform:scale(.9);opacity:.7}100%{transform:scale(1.9);opacity:0}}
.hphone{position:absolute;left:110px;top:10px;width:280px;height:auto;filter:drop-shadow(0 30px 60px rgba(var(--rgb-signal),.22));animation:float 7s var(--zn-ease-in-out) infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.c1{left:-60px;top:100px}.c2{left:250px;top:230px}.c3{left:-50px;top:410px}.c4{left:290px;top:530px}
.chip{opacity:0;translate:0 12px;transition:opacity var(--zn-dur-700) var(--ease),translate var(--zn-dur-700) var(--ease)}
.hv.in .chip{opacity:1;translate:0 0}
.hv.in .c1{transition-delay:.5s}.hv.in .c2{transition-delay:.8s}.hv.in .c3{transition-delay:1.1s}.hv.in .c4{transition-delay:1.4s}
.chip.c1{animation:bob 6s var(--zn-ease-in-out) 2s infinite}.chip.c2{animation:bob 7s var(--zn-ease-in-out) 2.6s infinite}.chip.c3{animation:bob 6.5s var(--zn-ease-in-out) 3s infinite}.chip.c4{animation:bob 7.5s var(--zn-ease-in-out) 2.3s infinite}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.chip-alert.flash{border-color:rgba(var(--rgb-alert),.8);box-shadow:0 0 0 4px rgba(var(--rgb-alert),.14),var(--shadow-chip)}
.chip-alert.flash :deep(.dot){animation:blink .3s steps(2) 4}
@keyframes blink{50%{opacity:.2}}

@media (max-width:1023px){
  .hero-in{grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:var(--zn-space-24)}
}
@media (max-width:640px){
  .hero{height:720px}
  .hero-in{display:flex;flex-direction:column;align-items:stretch;gap:var(--zn-space-24);padding-top:var(--zn-space-28)}
  .copy{gap:var(--zn-space-16)}
  .ctas{flex-wrap:nowrap;gap:var(--zn-space-10)}
  .ctas .btn{flex:1 1 0;padding:var(--zn-space-12) var(--zn-space-10);font-size:15px;line-height:22px}
  .hvbox{flex:1;height:auto;min-height:0;align-items:flex-start}
  .hv{width:350px;height:560px;transform:scale(var(--hs));transform-origin:50% 0}
  .hphone{left:50px;top:8px;width:250px}
  .g1{left:-20px;top:40px;width:390px;height:390px}.g2{left:110px;top:240px;width:300px;height:300px}
  .r1{width:225px;height:225px}.r2{width:315px;height:315px}.r3{width:405px;height:405px}
  .ring,.pulse{top:280px}
  .pulse{width:225px;height:225px;margin:-112px 0 0 -112px}
  .c1{left:-6px;top:90px}.c2{left:auto;right:-4px;top:200px}.c3,.c4{display:none}
  .chip{font-size:11px;padding:var(--zn-space-8) var(--zn-space-12)}
}
@media (max-width:380px){
  .ctas .btn{font-size:14px}
}
@media (prefers-reduced-motion:reduce){
  .chip{opacity:1;transform:none;translate:none}
}
@media (min-width:641px) and (max-width:1023px){
  .hero .ctas{flex-wrap:nowrap}
  .hero .btn-lg{padding:var(--zn-space-14) var(--zn-space-22)}
}
</style>
