<script setup>
/* GrapheneOS · errores: pestañas con avance automático (la barra marca el tiempo)
   y una órbita de íconos por cada pestaña. Se pausa fuera de pantalla o con el puntero encima. */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'
import { useInView } from '@/design-system/composables/useInView'
import { prefersReducedMotion } from '@/design-system/composables/useMedia'

const { t } = useT()
const reduce = prefersReducedMotion()
const tabs = [
  { n: '01', title: 'Una app mal elegida', text: 'GrapheneOS deja instalar apps de cualquier fuente. Una descarga equivocada basta.' },
  { n: '02', title: 'Un permiso de más', text: 'Cada permiso es una decisión tuya. Uno concedido con prisa sigue concedido.' },
  { n: '03', title: 'Lo que se guarda, se queda', text: 'Cachés, fotos y chats siguen ahí hasta que alguien los borra.' }
]
const panes = [
  { cls: 'c-alert', core: 'alert-triangle', cap: 'Una descarga equivocada', obs: [['c-aur', 'world'], ['c-ice', 'qrcode'], ['c-sig', 'file-off'], ['c-aur', 'apps-off']] },
  { cls: 'c-aur2', core: 'lock-open', cap: 'Un permiso concedido con prisa', obs: [['c-aur', 'camera'], ['c-alt', 'map-pin'], ['c-sig', 'microphone'], ['c-aur', 'address-book']] },
  { cls: 'c-ice2', core: 'history', cap: 'Lo que se acumula', obs: [['c-ice', 'photo'], ['c-aur', 'messages'], ['c-sig', 'file-text'], ['c-alt', 'clock']] }
]
const OB_POS = [['748px', '208px', '0s'], ['1108px', '288px', '-1.3s'], ['998px', '573px', '-2.1s'], ['683px', '468px', '-3s']]

const box = ref(null)
const active = ref(0)
/* la barra se vuelve a crear en cada cambio para reiniciar su animación */
const run = ref(0)
const paused = ref(false)
const hover = ref(false)
function go(n) { active.value = n; run.value++ }
function ended(k) { if (active.value === k) go((k + 1) % tabs.length) }
const visible = useInView(box, { threshold: 0.35 })
</script>

<template>
<section class="sec s02" id="errores" :aria-label="t('Errores')">
  <div class="frame" style="height:800px">
    <div class="dec">
      <span class="glow" style="left:580px;top:80px;width:600px;height:600px;--rgb:var(--rgb-alert);--a:.30"></span>
      <span class="glow" style="left:760px;top:240px;width:560px;height:560px;--rgb:var(--rgb-aurora);--a:.26"></span>
      <span class="ring" style="left:790px;top:250px;width:300px;height:300px;--a:.22"></span>
      <span class="ring" style="left:725px;top:185px;width:430px;height:430px;--a:.14"></span>
      <span class="ring" style="left:660px;top:120px;width:560px;height:560px;--a:.08"></span>
    </div>

    <h2 v-reveal class="h2 abs rv" style="left:80px;top:165px;width:520px">{{ t('Un sistema seguro') }}<br>{{ t('no te protege de ti.') }}</h2>

    <div ref="box" class="tabs02" :class="{ paused: !visible || hover }" id="tabs02" role="tablist" style="left:80px;top:285px;width:520px" @pointerenter="hover = true" @pointerleave="hover = false">
      <button v-for="(tb, k) in tabs" :key="k" class="t02" :class="{ on: active === k }" role="tab" :aria-selected="String(active === k)" @click="go(k)">
        <i :key="active === k ? 'on' + run : 'off'" class="bar" :style="reduce ? 'animation:none' : undefined" @animationend="ended(k)"></i><span class="n">{{ tb.n }}</span><b class="h3">{{ t(tb.title) }}</b>
        <p class="body">{{ t(tb.text) }}</p>
      </button>
    </div>

    <!-- órbita: tres escenas -->
    <div class="obox">
    <div class="orbit" id="orbit">
      <div v-for="(p, k) in panes" :key="k" class="pane" :class="[p.cls, { on: active === k }]">
        <div class="core"><span class="ico"><Icon :name="p.core" /></span></div>
        <div v-for="(o, j) in p.obs" :key="j" class="ob" :class="o[0]" :style="{ left: OB_POS[j][0], top: OB_POS[j][1], '--fd': OB_POS[j][2] }"><span class="ico"><Icon :name="o[1]" /></span></div>
        <p class="eyebrow cap">{{ t(p.cap) }}</p>
      </div>
    </div>
    </div>
  </div>
</section>
</template>

<style scoped>
.tabs02{position:absolute;display:flex;flex-direction:column}
.t02{position:relative;display:block;height:90px;border-top:1px solid rgba(var(--rgb-ice),.18);overflow:hidden;transition:height var(--zn-dur-550) var(--ease)}
.t02.on{height:170px}
.t02 .n{position:absolute;left:0;top:29px;font:var(--zn-weight-medium) 14px/20px var(--font-mono);color:rgba(var(--rgb-ice),.6);transition:color var(--dur-medium)}
.t02 .h3{position:absolute;left:52px;top:21px;width:468px;opacity:.45;transition:opacity var(--dur-medium)}
.t02:hover .h3{opacity:.75}
.t02 p{position:absolute;left:52px;top:71px;width:440px;opacity:0;transform:translateY(8px);transition:opacity var(--zn-dur-400) var(--ease) .1s,transform var(--zn-dur-400) var(--ease) .1s}
.t02.on .n{color:var(--color-signal)}
.t02.on .h3{opacity:1}
.t02.on p{opacity:1;transform:none}
.t02 .bar{position:absolute;left:0;top:-1px;height:2px;width:520px;background:linear-gradient(90deg,var(--color-signal),var(--color-aurora));box-shadow:0 0 10px rgba(var(--rgb-signal),.8);transform:scaleX(0);transform-origin:left}
.t02.on .bar{animation:fill var(--dur,6s) linear forwards}
@keyframes fill{to{transform:scaleX(1)}}
.paused .t02.on .bar{animation-play-state:paused}
.orbit{position:absolute;inset:0;pointer-events:none}
.pane{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity var(--zn-dur-600) var(--ease),visibility var(--zn-dur-600)}
.pane.on{opacity:1;visibility:visible}
.pane .core{position:absolute;left:865px;top:325px;width:150px;height:150px;border-radius:var(--radius-round);background:var(--color-ink);border:2px solid rgb(var(--rgb));box-shadow:0 0 60px rgba(var(--rgb),.55);display:grid;place-items:center;animation:corepulse 4s var(--zn-ease-in-out) infinite}
.pane .core .ico{width:64px;height:64px;color:rgb(var(--rgb))}
@keyframes corepulse{0%,100%{box-shadow:0 0 60px rgba(var(--rgb),.5)}50%{box-shadow:0 0 90px rgba(var(--rgb),.8)}}
.pane .cap{position:absolute;left:790px;width:300px;top:700px;text-align:center;color:rgb(var(--rgb))}
.pane.c-aur2 .cap{color:var(--color-aurora)}
.pane.on .ob{animation-name:floaty,popin}
.pane.on .ob{animation-duration:7s,.7s;animation-iteration-count:infinite,1;animation-delay:var(--fd,0s),0s;animation-fill-mode:none,backwards}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes popin{from{opacity:0;scale:.6}to{opacity:1;scale:1}}

@media (max-width:1023px){
  .tabs02 .bar{width:100%}
  .t02,.t02.on{height:auto;padding:22px 0 22px 44px}
  .t02 .n{top:25px}
  .t02 .h3{position:static;width:auto}
  .t02 p{position:static;width:auto;display:none;margin-top:8px}
  .t02.on p{display:block;animation:fadeup .45s var(--ease) both}
  @keyframes fadeup{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  #orbit{position:absolute;left:0;top:0;width:560px;height:550px;transform:scale(var(--os,1));transform-origin:0 0}
  .orbit::before{content:"";position:absolute;left:30px;top:-40px;width:540px;height:540px;border-radius:var(--radius-round);background:radial-gradient(closest-side,rgba(var(--rgb-alert),.24),rgba(var(--rgb-aurora),.12) 60%,rgba(var(--rgb-aurora),0))}
  .orbit .pane{inset:auto;left:-640px;top:-170px;width:1280px;height:800px}
  .orbit .cap{font-size:15px;line-height:20px}
}
@media (max-width:1023px) and (prefers-reduced-motion:reduce){.t02.on p{animation:none}}
</style>
