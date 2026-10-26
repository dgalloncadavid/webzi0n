<script setup>
/* Cripto · el riesgo real: cuatro escenarios ilustrados que solo corren en pantalla. */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import Card from '@/design-system/components/Card.vue'
import Badge from '@/design-system/components/Badge.vue'
import { useT } from '@/design-system/composables/useLang'
import { useInView } from '@/design-system/composables/useInView'

const { t } = useT()
const c1 = ref(null), c2 = ref(null), c3 = ref(null), c4 = ref(null)
const el = (r) => () => r.value && r.value.$el
const run = [c1, c2, c3, c4].map((r) => useInView(el(r), { threshold: 0.3 }))

/* temporizador del escenario 04: 10 s dentro del ciclo de 4,4 s */
const lost = ref('00:10')
let raf = 0
onMounted(() => {
  const L = 4400
  let t0 = 0
  const tick = (now) => {
    raf = requestAnimationFrame(tick)
    if (!run[3].value) { t0 = 0; return }
    if (!t0) t0 = now
    const p = ((now - t0) % L) / L
    const q = Math.min(1, Math.max(0, (p - 0.2) / 0.66))
    const v = Math.ceil(10 * (1 - q))
    lost.value = '00:' + (v < 10 ? '0' : '') + v
  }
  tick(performance.now())
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
<section class="sec" id="riesgo" :aria-label="t('El riesgo real')">
  <div class="glowbg" style="--rgb:var(--rgb-alert);left:-10%;top:10%"></div>
  <div class="wrap">
    <SectionHeader v-reveal class="rv" :eyebrow="t('El riesgo real')" :title="t('El punto débil ya no es tu wallet. Eres tú.')" :lead="t('A medida que los protocolos y las wallets se vuelven más seguros, el ataque se mueve hacia la persona. Estas son las situaciones para las que Zi0n está diseñado.')" />
    <div class="grid4">
      <Card ref="c1" v-reveal class="scn-card rv" :class="{ run: run[0].value }" style="--d:0s">
        <svg class="ill i-pin" viewBox="0 0 220 120" aria-hidden="true">
          <rect class="ph" x="70" y="8" width="80" height="104" rx="14"/>
          <text class="lab" x="110" y="34">PIN</text>
          <circle class="pd d1" cx="86" cy="52" r="5"/><circle class="pd d2" cx="102" cy="52" r="5"/><circle class="pd d3" cx="118" cy="52" r="5"/><circle class="pd d4" cx="134" cy="52" r="5"/>
          <g class="px"><rect x="82" y="70" width="14" height="14" rx="3"/><rect x="103" y="70" width="14" height="14" rx="3"/><rect x="124" y="70" width="14" height="14" rx="3"/><rect x="82" y="88" width="14" height="14" rx="3"/><rect x="103" y="88" width="14" height="14" rx="3"/><rect x="124" y="88" width="14" height="14" rx="3"/></g>
          <text class="wiped" x="110" y="92">{{ t('BORRADO') }}</text>
        </svg>
        <div class="chead"><span class="eyebrow">{{ t('Escenario 01') }}</span><Badge variant="strong" tone="alert">{{ t('Borra') }}</Badge></div>
        <h3 class="h5">{{ t('Te lo piden en la calle') }}</h3>
        <p class="small">{{ t('Un PIN adicional en la pantalla de bloqueo borra el sistema en segundos.') }}</p>
      </Card>
      <Card ref="c2" v-reveal class="scn-card rv" :class="{ run: run[1].value }" style="--d:.08s">
        <svg class="ill i-cable" viewBox="0 0 220 120" aria-hidden="true">
          <g class="plug"><line x1="0" y1="60" x2="56" y2="60"/><rect class="pb" x="56" y="50" width="26" height="20" rx="4"/><rect class="pt" x="82" y="55" width="9" height="10" rx="2"/></g>
          <circle class="spark" cx="100" cy="60" r="8"/>
          <rect class="ph" x="100" y="10" width="96" height="100" rx="14"/>
          <line class="port" x1="100" y1="52" x2="100" y2="68"/>
          <g class="scr"><rect x="116" y="28" width="26" height="20" rx="4"/><rect x="152" y="28" width="26" height="20" rx="4"/><line x1="116" y1="66" x2="178" y2="66" stroke-dasharray="4 4"/><line x1="116" y1="80" x2="158" y2="80"/></g>
          <text class="wiped" x="148" y="64">{{ t('BORRADO') }}</text>
        </svg>
        <div class="chead"><span class="eyebrow">{{ t('Escenario 02') }}</span><Badge variant="strong" tone="alert">{{ t('Borra') }}</Badge></div>
        <h3 class="h5">{{ t('Conectan un cable') }}</h3>
        <p class="small">{{ t('Si el celular detecta un cable conectado, el sistema se elimina.') }}</p>
      </Card>
      <Card ref="c3" v-reveal class="scn-card rv" :class="{ run: run[2].value }" style="--d:.16s">
        <svg class="ill i-sim" viewBox="0 0 220 120" aria-hidden="true">
          <rect class="ph" x="40" y="10" width="96" height="100" rx="14"/>
          <g class="prompt"><rect x="54" y="34" width="68" height="44" rx="7"/><circle cx="72" cy="56" r="3"/><circle cx="83" cy="56" r="3"/><circle cx="94" cy="56" r="3"/><circle cx="105" cy="56" r="3"/></g>
          <g class="simc"><path d="M140 38h24l8 8v30h-32z"/><rect x="148" y="50" width="14" height="13" rx="2"/></g>
          <text class="q" x="190" y="66">?</text>
        </svg>
        <div class="chead"><span class="eyebrow">{{ t('Escenario 03') }}</span><Badge variant="strong" tone="alert">{{ t('Borra') }}</Badge></div>
        <h3 class="h5">{{ t('Te lo roban') }}</h3>
        <p class="small">{{ t('Un cambio de SIM no autorizado pide tu PIN o elimina el sistema. El botón de pánico borra todo con una combinación de botones.') }}</p>
      </Card>
      <Card ref="c4" v-reveal class="scn-card rv" :class="{ run: run[3].value }" style="--d:.24s">
        <svg class="ill i-lost" viewBox="0 0 220 120" aria-hidden="true">
          <g class="bars"><rect x="40" y="70" width="8" height="12" rx="2"/><rect x="52" y="62" width="8" height="20" rx="2"/><rect x="64" y="54" width="8" height="28" rx="2"/><rect x="76" y="46" width="8" height="36" rx="2"/></g>
          <line class="cross" x1="36" y1="88" x2="90" y2="40"/>
          <circle class="trk" cx="150" cy="60" r="34"/>
          <circle class="arc" cx="150" cy="60" r="34" pathLength="100" transform="rotate(-90 150 60)"/>
          <text class="tnum" x="150" y="65" id="lostNum">{{ lost }}</text>
        </svg>
        <div class="chead"><span class="eyebrow">{{ t('Escenario 04') }}</span><Badge variant="strong" tone="alert">{{ t('Borra') }}</Badge></div>
        <h3 class="h5">{{ t('Lo pierdes') }}</h3>
        <p class="small">{{ t('Sin señal por mucho tiempo, o con un temporizador de inactividad que tú configuras, el sistema se borra solo.') }}</p>
      </Card>
    </div>
    <p v-reveal class="h4 closing rv">{{ t('Y mientras tanto, quien lo tenga en la mano solo ve un celular común.') }}</p>
  </div>
</section>
</template>

<style scoped>
#riesgo{--L:4.4s}
.grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--zn-space-24)}
.scn-card{display:flex;flex-direction:column;gap:var(--zn-space-16)}
.chead{display:flex;align-items:center;justify-content:space-between;gap:var(--zn-space-8)}
.closing{text-align:center;margin-top:var(--zn-space-48)}
.ill{display:block;width:100%;height:auto;aspect-ratio:220/120;border-radius:var(--zn-radius-16);background:rgba(var(--rgb-ink),.55);border:1px solid var(--color-line);fill:none;stroke:var(--color-ice);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;overflow:hidden}
.ill text{stroke:none;fill:var(--color-ice);font-family:var(--font-mono);text-anchor:middle}
.ill .ph{stroke-opacity:.5}
.ill .lab{font-size:9px;letter-spacing:1.5px;fill:var(--color-muted)}
.ill .wiped{font-size:9px;letter-spacing:2px;font-weight:800;fill:var(--color-alert);opacity:0}
/* 01 PIN bajo presión */
.i-pin .pd{fill:transparent}
.run .i-pin .pd{animation:pdf var(--L) infinite}
.run .i-pin .d2{animation-delay:.18s}.run .i-pin .d3{animation-delay:.36s}.run .i-pin .d4{animation-delay:.54s}
@keyframes pdf{0%,12%{fill:transparent;stroke:#B7D3E7}26%,62%{fill:#FF5C6C;stroke:#FF5C6C}74%,100%{fill:transparent;stroke:#B7D3E7}}
.run .i-pin .px{animation:pxd var(--L) var(--ease) infinite}
@keyframes pxd{0%,48%{opacity:1;transform:none}62%,86%{opacity:0;transform:translateY(-8px) scale(.9)}100%{opacity:1;transform:none}}
.run .i-pin .wiped{animation:wip var(--L) infinite}
@keyframes wip{0%,56%{opacity:0}62%,86%{opacity:1}92%,100%{opacity:0}}
.run .i-pin .ph{animation:phr var(--L) infinite}
@keyframes phr{0%,22%{stroke:#B7D3E7;stroke-opacity:.5}28%,86%{stroke:#FF5C6C;stroke-opacity:1}96%,100%{stroke:#B7D3E7;stroke-opacity:.5}}
/* 02 cable */
.i-cable .pt{stroke:var(--color-alert)}
.i-cable .pb{fill:var(--color-ink)}
.i-cable .port{stroke-width:3}
.i-cable .spark{stroke:var(--color-alert);opacity:0;transform-box:fill-box;transform-origin:center}
.run .i-cable .plug{animation:plug var(--L) var(--ease) infinite}
@keyframes plug{0%,12%{transform:translateX(-30px)}34%,82%{transform:none}96%,100%{transform:translateX(-30px)}}
.run .i-cable .spark{animation:spk var(--L) var(--zn-ease-out) infinite}
@keyframes spk{0%,32%{opacity:0;transform:scale(.4)}35%{opacity:1}52%,100%{opacity:0;transform:scale(2.6)}}
.run .i-cable .scr{animation:scr var(--L) infinite}
@keyframes scr{0%,40%{opacity:1}52%,84%{opacity:.08}96%,100%{opacity:1}}
.run .i-cable .wiped{animation:wip2 var(--L) infinite}
@keyframes wip2{0%,50%{opacity:0}56%,84%{opacity:1}92%,100%{opacity:0}}
.run .i-cable .ph{animation:phr var(--L) infinite}
/* 03 SIM */
.i-sim .prompt rect{stroke:var(--color-alert)}
.i-sim .prompt circle{fill:var(--color-ice);stroke:none}
.i-sim .simc path{fill:var(--color-ink)}
.i-sim .q{font-size:26px;font-weight:800;fill:var(--color-alert);opacity:0}
.run .i-sim .simc{animation:sim var(--L) var(--ease) infinite}
@keyframes sim{0%,16%{transform:translateX(-18px);opacity:.6}36%,80%{transform:translateX(10px);opacity:1}96%,100%{transform:translateX(-18px);opacity:.6}}
.run .i-sim .prompt{animation:prm var(--L) infinite}
@keyframes prm{0%,34%{opacity:.15}46%,82%{opacity:1}94%,100%{opacity:.15}}
.run .i-sim .q{animation:qq var(--L) infinite}
@keyframes qq{0%,40%{opacity:0;transform:translateY(4px)}50%,80%{opacity:1;transform:none}92%,100%{opacity:0}}
.run .i-sim .ph{animation:phr var(--L) infinite}
/* 04 lo pierdes */
.i-lost .bars rect{fill:var(--color-ice);stroke:none;transform-box:fill-box;transform-origin:bottom}
.i-lost .cross{stroke:var(--color-alert);stroke-width:2.4;stroke-dasharray:80;stroke-dashoffset:80}
.i-lost .trk{stroke-opacity:.18;stroke-width:4}
.i-lost .arc{stroke:var(--color-alert);stroke-width:4;stroke-dasharray:100;stroke-dashoffset:0;filter:drop-shadow(0 0 6px rgba(var(--rgb-alert),.7))}
.i-lost .tnum{font-size:14px;font-weight:800;fill:var(--color-mist)}
.run .i-lost .bars rect{animation:bar var(--L) var(--ease) infinite}
.run .i-lost .bars rect:nth-child(3){animation-delay:.08s}.run .i-lost .bars rect:nth-child(2){animation-delay:.16s}.run .i-lost .bars rect:nth-child(1){animation-delay:.24s}
@keyframes bar{0%,10%{transform:scaleY(1);fill:#B7D3E7}26%,86%{transform:scaleY(.2);fill:#FF5C6C}100%{transform:scaleY(1);fill:#B7D3E7}}
.run .i-lost .cross{animation:crs var(--L) infinite}
@keyframes crs{0%,22%{stroke-dashoffset:80}32%,86%{stroke-dashoffset:0}96%,100%{stroke-dashoffset:80}}
.run .i-lost .arc{animation:arcA var(--L) linear infinite}
@keyframes arcA{0%,20%{stroke-dashoffset:0}86%,94%{stroke-dashoffset:100}100%{stroke-dashoffset:0}}

@media (max-width:1180px){
  .grid4{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:640px){
  .grid4{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--pad);gap:var(--zn-space-12);margin:0 calc(var(--pad) * -1);padding:var(--zn-space-4) var(--pad) var(--zn-space-12);scrollbar-width:none}
  .grid4::-webkit-scrollbar{display:none}
  .grid4>.card{flex:0 0 min(300px,calc(100vw - 72px));scroll-snap-align:start}
  .grid4::after{content:"";flex:0 0 1px}
  .ill{aspect-ratio:220/100}
  .closing{margin-top:var(--zn-space-32)}
}
</style>
