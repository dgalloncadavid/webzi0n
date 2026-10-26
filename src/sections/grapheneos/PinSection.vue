<script setup>
/* GrapheneOS · borrado con PIN: tres pasos sobre un riel y la emergencia de 5 pulsaciones.
   Los puntos del PIN y las pulsaciones se animan solo mientras se ven. */
import { ref, onBeforeUnmount } from 'vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'
import { useInView } from '@/design-system/composables/useInView'

const { t } = useT()

/* paso 2: los puntos del PIN se llenan de a uno */
const st2 = ref(null)
const pc = ref(0)
let t1 = null
function seq() { pc.value++; if (pc.value > 5) pc.value = 0 }
useInView(st2, { threshold: 0.5, onChange(on) { if (on) { if (!t1) t1 = setInterval(seq, 650) } else { clearInterval(t1); t1 = null } } })

/* emergencia: cinco pulsaciones, una pausa y vuelta a empezar */
const emerg = ref(null)
const ic = ref(null)
const hit = ref(-1)
let pi = 0
let t2 = null
function pr() {
  if (pi < 5) {
    hit.value = pi
    const el = ic.value
    el.classList.remove('wave'); void el.offsetWidth; el.classList.add('wave')
    pi++
  } else if (pi === 5) { hit.value = -1; pi++ }
  else if (pi < 8) { pi++ }
  else { pi = 0 }
}
useInView(emerg, { threshold: 0.5, onChange(on) { if (on) { if (!t2) t2 = setInterval(pr, 520) } else { clearInterval(t2); t2 = null } } })
onBeforeUnmount(() => { clearInterval(t1); clearInterval(t2) })
</script>

<template>
<section class="sec s04" id="pin" :aria-label="t('Borrado con PIN')">
  <div class="frame" style="height:818px">
    <div class="dec">
      <span class="glow" style="left:180px;top:150px;width:640px;height:640px;--rgb:var(--rgb-alert);--a:.26"></span>
      <span class="glow" style="left:520px;top:140px;width:560px;height:560px;--rgb:var(--rgb-signal);--a:.18"></span>
      <span class="ring" style="left:140px;top:202px;width:200px;height:200px;--a:.16"></span>
      <span class="ring" style="left:100px;top:162px;width:280px;height:280px;--a:.08"></span>
      <span class="ring" style="left:540px;top:202px;width:200px;height:200px;--a:.16"></span>
      <span class="ring" style="left:500px;top:162px;width:280px;height:280px;--a:.08"></span>
      <span class="ring" style="left:940px;top:202px;width:200px;height:200px;--a:.16"></span>
      <span class="ring" style="left:900px;top:162px;width:280px;height:280px;--a:.08"></span>
    </div>
    <h2 v-reveal class="h2 abs rv" style="left:80px;top:96px;width:1120px;text-align:center">{{ t('Pensado para que no borres por error') }}</h2>

    <div v-reveal class="rail" id="rail" style="left:240px;top:300.5px;width:800px"><i></i></div>

    <div v-reveal class="step" id="st1" style="left:140px;top:196px;--sd:0.15s">
      <p class="eyebrow" style="color:var(--color-alert)">{{ t('Paso 1') }}</p>
      <div class="node c-alert"><span class="ico"><Icon name="bell-ringing" /></span></div>
      <h3 class="h3">{{ t('Te avisa') }}</h3>
      <p class="body">{{ t('El teléfono suena y vibra.') }}</p>
    </div>
    <div ref="st2" v-reveal class="step" id="st2" style="left:540px;top:196px;--sd:0.6s">
      <p class="eyebrow" style="color:var(--color-aurora)">{{ t('Paso 2') }}</p>
      <div class="node c-aur2"><span class="pdots"><i v-for="k in 4" :key="k" :class="{ on: k - 1 < Math.min(pc, 3) }"></i></span></div>
      <h3 class="h3">{{ t('Tú decides') }}</h3>
      <p class="body">{{ t('Pones tu PIN en pantalla.') }}</p>
    </div>
    <div v-reveal class="step" id="st3" style="left:940px;top:196px;--sd:1.05s">
      <p class="eyebrow" style="color:var(--color-signal)">{{ t('Paso 3') }}</p>
      <div class="node c-sig2"><span class="ico"><Icon name="trash" /></span></div>
      <h3 class="h3">{{ t('Si no hay PIN') }}</h3>
      <p class="body">{{ t('El sistema se elimina. Las claves se destruyen.') }}</p>
    </div>

    <div ref="emerg" class="emerg" id="emerg" style="left:100px;top:554px">
      <div class="em-l">
        <div ref="ic" class="em-ic"><span class="ico"><Icon name="volume" /></span></div>
        <div class="em-tx">
          <h3 class="h3">{{ t('Emergencia') }}</h3>
          <p class="body">{{ t('5 pulsaciones del botón de volumen.') }}<br>{{ t('Sin código: es un gesto físico.') }}</p>
        </div>
      </div>
      <div class="em-n" id="presses">
        <b v-for="k in 5" :key="k" :class="{ hit: hit === k - 1 }" :style="'--g:' + (0.3 + k / 10).toFixed(1)">{{ k }}</b>
      </div>
    </div>
  </div>
</section>
</template>

<style scoped>
.rail{position:absolute;height:3px}
.rail i{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,var(--color-alert),var(--color-signal));box-shadow:0 0 12px rgba(var(--rgb-ice),.6);transform:scaleX(0);transform-origin:left;transition:transform var(--zn-dur-1600) var(--ease) .3s}
.rail.in i{transform:scaleX(1)}
.step{position:absolute;width:200px;text-align:center}
.step .eyebrow{height:16px}
.node{position:relative;width:132px;height:132px;margin:24px auto 0;border-radius:var(--radius-round);background:var(--color-ink);border:2px solid rgb(var(--rgb));box-shadow:0 0 50px rgba(var(--rgb),.6);display:grid;place-items:center}
.node .ico{width:40px;height:40px;color:rgb(var(--rgb))}
.step .h3{width:300px;margin:32px -50px 0}
.step .body{width:260px;margin:12px -30px 0}
.pdots{display:flex;gap:12px}
.pdots i{width:14px;height:14px;border-radius:var(--radius-round);border:1.5px solid var(--color-aurora);transition:background var(--dur-medium),box-shadow var(--dur-medium)}
.pdots i.on{background:var(--color-aurora);box-shadow:0 0 10px rgba(var(--rgb-aurora),.9)}
/* revelado propio de los pasos: entran en cascada con --sd */
:is(.s04) .step{opacity:0;transform:translateY(24px);transition:opacity var(--zn-dur-800) var(--ease) var(--sd,0s),transform var(--zn-dur-800) var(--ease) var(--sd,0s)}
:is(.s04) .step.in{opacity:1;transform:none}
.step.in .node{animation:nodep 4s var(--zn-ease-in-out) var(--sd,0s) infinite}
@keyframes nodep{0%,100%{box-shadow:0 0 50px rgba(var(--rgb),.5)}50%{box-shadow:0 0 80px rgba(var(--rgb),.85)}}
.emerg{position:absolute;width:1080px;height:168px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;border:1px solid rgba(var(--rgb-alert),.4);border-radius:var(--zn-radius-84);background:linear-gradient(90deg,rgba(var(--rgb-alert),.22),rgba(var(--rgb-ink),.9));overflow:hidden}
.em-l{display:flex;align-items:center;gap:32px}
.em-ic{width:96px;height:96px;border-radius:var(--radius-round);background:var(--color-ink);border:1.5px solid var(--color-alert);box-shadow:0 0 28px rgba(var(--rgb-alert),.7);display:grid;place-items:center;flex:none}
.em-ic .ico{width:40px;height:40px;color:var(--color-alert)}
.em-ic.wave{animation:wave 1s var(--zn-ease-out)}
@keyframes wave{0%{box-shadow:0 0 28px rgba(255,92,108,.7)}40%{box-shadow:0 0 56px rgba(255,92,108,1)}100%{box-shadow:0 0 28px rgba(255,92,108,.7)}}
.em-tx{display:flex;flex-direction:column;gap:6px}
.em-n{display:flex;gap:20px;align-items:center}
.em-n b{width:76px;height:76px;border-radius:var(--radius-round);display:grid;place-items:center;background:var(--color-alert);border:1.5px solid var(--color-alert);font:var(--zn-weight-extrabold) 22px/30px var(--font-mono);letter-spacing:-.5px;color:var(--color-mist);box-shadow:0 0 14px rgba(var(--rgb-alert),calc(var(--g)));transition:transform var(--dur-base) var(--ease),box-shadow var(--dur-base)}
.em-n b.hit{opacity:1;transform:scale(1.1);box-shadow:0 0 30px rgba(var(--rgb-alert),.95)}

@media (max-width:1023px){
  .s04 .h2{text-align:center}
  .rail{display:none}
  .step{align-self:center;max-width:320px!important;margin-bottom:56px}
  .step .h3{width:auto;margin:22px 0 0}
  .step .body{width:auto;margin:8px 0 0}
  .node{width:112px;height:112px;margin-top:16px}
  #st1::after,#st2::after{content:"";position:absolute;left:50%;bottom:-44px;width:2px;height:32px;margin-left:-1px;border-radius:2px;background:linear-gradient(180deg,rgba(var(--rgb-ice),.5),rgba(var(--rgb-ice),0))}
  .emerg{height:auto;flex-direction:column;align-items:stretch;gap:24px;padding:28px 22px;border-radius:var(--zn-radius-28);background:linear-gradient(180deg,rgba(var(--rgb-alert),.22),rgba(var(--rgb-ink),.9))}
  .em-l{gap:18px}
  .em-ic{width:68px;height:68px}
  .em-ic .ico{width:30px;height:30px}
  .em-n{justify-content:space-between;gap:8px}
  .em-n b{width:min(52px,calc((100vw - 128px) / 5));height:auto;aspect-ratio:1;font-size:18px}
}
@media (max-width:1023px){
  /* pasos en filas: ícono a la izquierda, texto a la derecha */
  .s04 .h2{text-align:left!important}
  .step{display:grid!important;grid-template-columns:84px 1fr;column-gap:18px;align-items:center;text-align:left;max-width:none!important;width:100%!important;align-self:stretch;margin-bottom:32px}
  .step .eyebrow{grid-column:2;grid-row:1;height:auto;align-self:end}
  .step .node{grid-column:1;grid-row:1/4;width:84px;height:84px;margin:0}
  .step .node .ico{width:32px;height:32px}
  .step .h3{grid-column:2;grid-row:2;margin:4px 0 0}
  .step .body{grid-column:2;grid-row:3;margin:2px 0 0;align-self:start}
  .pdots{gap:6px}.pdots i{width:11px;height:11px}
  #st1::after,#st2::after{left:42px;bottom:-30px;height:24px;margin-left:-1px}
  #st3{margin-bottom:36px}
}
@media (prefers-reduced-motion:reduce){
  :is(.s04) .step{opacity:1;transform:none}
}
</style>
