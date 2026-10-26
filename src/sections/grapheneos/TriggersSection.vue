<script setup>
/* GrapheneOS · disparadores: cuatro escenarios (cable, SIM, señal, temporizador).
   Avanzan solos cada 6 s mientras la sección se ve; las pestañas cambian de escenario. */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'
import { useInView } from '@/design-system/composables/useInView'
import { useMediaQuery, prefersReducedMotion } from '@/design-system/composables/useMedia'

const { t } = useT()
const reduce = prefersReducedMotion()
const D = [
  { t: 'Alguien conecta un cable.', p: 'El teléfono suena, vibra y te pide tu PIN. Si no lo pones, se borra.', s: 'Escenario 01 // Puerto USB' },
  { t: 'Cambian tu SIM.', p: 'Si sacan tu SIM o ponen otra, el teléfono suena, vibra y te pide tu PIN. Si no lo pones, se borra.', s: 'Escenario 02 // Bandeja SIM' },
  { t: 'Se pierde la señal.', p: 'Si el teléfono queda sin señal, por ejemplo dentro de una bolsa inhibidora, suena, vibra y te pide tu PIN antes de borrar.', s: 'Escenario 03 // Sin señal' },
  { t: 'Se acaba el tiempo.', p: 'Con el temporizador activo, el teléfono te avisa y espera tu PIN antes de borrar.', s: 'Escenario 04 // Temporizador' }
]
const PILLS = [['plug-connected', 'Cable'], ['device-sim', 'Cambio de SIM'], ['antenna-bars-off', 'Sin señal'], ['hourglass', 'Temporizador']]
const T = 6000

const sec = ref(null)
const stage = ref(null)
const row = ref(null)
const scn = []
const pillEls = []
const mobile = useMediaQuery('(max-width:1023px)')
/* en celulares la escena se recorta a lo esencial */
const vb = ref(mobile.value ? '40 16 440 428' : '0 0 520 460')
watch(mobile, (m) => { vb.value = m ? '40 16 440 428' : '0 0 520 460' })

const i = ref(0)
const textIdx = ref(0)
const out = ref(false)
const idxOpacity = ref(1)
const tnum = ref('00:10')
let auto = null
let paused = true
let t0 = 0
let raf = 0
let swap = null

function rerun(el) { el.classList.remove('run'); void el.getBoundingClientRect(); el.classList.add('run') }
function show(n) {
  i.value = n
  scn.forEach((s, k) => { s.classList.toggle('on', k === n); s.classList.remove('run') })
  rerun(scn[n]); rerun(stage.value); t0 = performance.now()
  const r = row.value
  if (mobile.value && r.scrollWidth > r.clientWidth) {
    const pd = parseFloat(getComputedStyle(r).paddingLeft) || 0
    r.scrollTo({ left: Math.max(0, pillEls[n].offsetLeft - r.offsetLeft - pd), behavior: 'smooth' })
  }
  out.value = true
  idxOpacity.value = 0
  clearTimeout(swap)
  swap = setTimeout(() => { textIdx.value = n; idxOpacity.value = 1; out.value = false }, 220)
}
function tick(now) {
  raf = requestAnimationFrame(tick)
  if (i.value !== 3) return
  const p = ((now - t0) % T) / T
  const q = Math.min(1, Math.max(0, (p - 0.06) / 0.68))
  const v = Math.ceil(10 * (1 - q))
  tnum.value = '00:' + (v < 10 ? '0' : '') + v
}
function restart() { clearInterval(auto); if (!paused && !reduce) auto = setInterval(() => show((i.value + 1) % D.length), T) }
function pick(k) { show(k); restart() }

onMounted(() => show(0))
useInView(sec, {
  threshold: 0.35,
  onChange(on) {
    paused = !on
    if (paused) { clearInterval(auto); cancelAnimationFrame(raf); stage.value.classList.add('paused') }
    else { stage.value.classList.remove('paused'); show(i.value); restart(); raf = requestAnimationFrame(tick) }
  }
})
onBeforeUnmount(() => { clearInterval(auto); cancelAnimationFrame(raf); clearTimeout(swap) })
</script>

<template>
<section ref="sec" class="sec s05" id="disparadores" :aria-label="t('Disparadores')" :data-sc="i">
  <div class="frame" style="height:780px">
    <div class="dec">
      <span class="glow" style="left:610px;top:40px;width:700px;height:700px;--rgb:var(--rgb-alert);--a:.30"></span>
      <span class="ring" style="left:750px;top:180px;width:420px;height:420px;--a:.16"></span>
      <span class="ring" style="left:690px;top:120px;width:540px;height:540px;--a:.09"></span>
      <span class="ring" style="left:630px;top:60px;width:660px;height:660px;--a:.05"></span>
    </div>
    <h2 v-reveal class="h2 abs rv" style="left:80px;top:251px;width:620px">{{ t('Servicios que Zi0n vigila en segundo plano por ti') }}</h2>
    <div ref="row" class="pills" id="pills" role="tablist" style="left:80px;top:363px">
      <button v-for="(p, k) in PILLS" :key="k" :ref="(el) => (pillEls[k] = el)" class="pill" :class="{ on: i === k }" role="tab" :aria-selected="String(i === k)" @click="pick(k)"><span class="ico"><Icon :name="p[0]" /></span>{{ t(p[1]) }}</button>
    </div>
    <div class="content05" :class="{ out }" style="left:80px;top:451px;width:648px" aria-live="polite">
      <h3 class="h2" id="tT">{{ t(D[textIdx].t) }}</h3>
      <p class="body-lg" id="tP">{{ t(D[textIdx].p) }}</p>
    </div>

    <div ref="stage" class="stage05" id="stage05" style="left:700px;top:84px">
      <div class="shead"><span class="eyebrow sidx" id="sIdx" :style="{ opacity: idxOpacity }">{{ t(D[textIdx].s) }}</span><span class="stag" id="sTag">{{ t('Se borra') }}</span></div>
      <div class="sbox">
  <svg :ref="(el) => (scn[0] = el)" class="scn" data-n="0" :viewBox="vb" aria-hidden="true">

      <g class="vib"><path d="M171 134 q-8 30 0 60"/><path d="M159 124 q-12 40 0 80"/><path d="M349 134 q8 30 0 60"/><path d="M361 124 q12 40 0 80"/></g>
      <rect class="ph" x="185" y="24" width="150" height="290" rx="26"/>
      <line class="notch" x1="244.0" y1="40" x2="276.0" y2="40"/>
      <g class="apps"><rect class="px" style="--d:0.00s" x="207" y="94" width="28" height="28" rx="7"/><rect class="px" style="--d:0.04s" x="245" y="94" width="28" height="28" rx="7"/><rect class="px" style="--d:0.08s" x="283" y="94" width="28" height="28" rx="7"/><rect class="px" style="--d:0.12s" x="207" y="132" width="28" height="28" rx="7"/><rect class="px" style="--d:0.16s" x="245" y="132" width="28" height="28" rx="7"/><rect class="px" style="--d:0.00s" x="283" y="132" width="28" height="28" rx="7"/><rect class="px" style="--d:0.04s" x="207" y="170" width="28" height="28" rx="7"/><rect class="px" style="--d:0.08s" x="245" y="170" width="28" height="28" rx="7"/><rect class="px" style="--d:0.12s" x="283" y="170" width="28" height="28" rx="7"/></g>
      <g class="pr">
        <rect class="prb" x="199" y="110" width="122" height="104" rx="12"/>
        <text class="prl" x="260.0" y="134">{{ t('CABLE DETECTADO') }}</text>
        <text class="prt" x="260.0" y="156">{{ t('INGRESA TU PIN') }}</text>
        <circle class="pd" cx="230.0" cy="176" r="4.5"/><circle class="pd" cx="250.0" cy="176" r="4.5"/><circle class="pd" cx="270.0" cy="176" r="4.5"/><circle class="pd" cx="290.0" cy="176" r="4.5"/>
        <rect class="cdt" x="215" y="196" width="90" height="4" rx="2"/>
        <rect class="cdf" x="215" y="196" width="90" height="4" rx="2"/>
      </g>
      <g class="done"><text class="dn" x="260.0" y="174">{{ t('BORRADO') }}</text><line x1="226.0" y1="186" x2="294.0" y2="186"/></g>
    <rect class="port" x="246" y="311" width="28" height="6" rx="3"/>
    <circle class="spark" cx="260" cy="314" r="10"/>
    <g class="plug">
      <path class="cable" d="M260 376 V 520"/>
      <path class="cdata" d="M260 376 V 520"/>
      <rect class="pb" x="243" y="334" width="34" height="44" rx="8"/>
      <rect class="pt" x="250" y="320" width="20" height="14" rx="3"/>
      <line x1="253" y1="350" x2="267" y2="350"/><line x1="253" y1="358" x2="267" y2="358"/>
    </g>
  </svg>
  <svg :ref="(el) => (scn[1] = el)" class="scn" data-n="1" :viewBox="vb" aria-hidden="true">
    <g class="tray">
      <rect class="tr" x="190" y="120" width="160" height="92" rx="12"/>
      <circle class="tph" cx="336" cy="166" r="4"/>
      <rect class="tcut" x="262" y="128" width="60" height="76" rx="6"/>
      <g class="so"><path d="M264 133a4 4 0 0 1 4-4h34l14 14v56a4 4 0 0 1-4 4h-44a4 4 0 0 1-4-4z"/><rect x="276" y="153" width="28" height="24" rx="4"/><line x1="276" y1="165" x2="304" y2="165"/><line x1="290" y1="153" x2="290" y2="177"/></g><g class="sn"><path d="M264 133a4 4 0 0 1 4-4h34l14 14v56a4 4 0 0 1-4 4h-44a4 4 0 0 1-4-4z"/><text class="sq" x="290" y="175">?</text></g>
    </g>

      <g class="vib"><path d="M96 134 q-8 30 0 60"/><path d="M84 124 q-12 40 0 80"/><path d="M274 134 q8 30 0 60"/><path d="M286 124 q12 40 0 80"/></g>
      <rect class="ph" x="110" y="24" width="150" height="290" rx="26"/>
      <line class="notch" x1="169.0" y1="40" x2="201.0" y2="40"/>
      <g class="apps"><rect class="px" style="--d:0.00s" x="132" y="94" width="28" height="28" rx="7"/><rect class="px" style="--d:0.04s" x="170" y="94" width="28" height="28" rx="7"/><rect class="px" style="--d:0.08s" x="208" y="94" width="28" height="28" rx="7"/><rect class="px" style="--d:0.12s" x="132" y="132" width="28" height="28" rx="7"/><rect class="px" style="--d:0.16s" x="170" y="132" width="28" height="28" rx="7"/><rect class="px" style="--d:0.00s" x="208" y="132" width="28" height="28" rx="7"/><rect class="px" style="--d:0.04s" x="132" y="170" width="28" height="28" rx="7"/><rect class="px" style="--d:0.08s" x="170" y="170" width="28" height="28" rx="7"/><rect class="px" style="--d:0.12s" x="208" y="170" width="28" height="28" rx="7"/></g>
      <g class="pr">
        <rect class="prb" x="124" y="110" width="122" height="104" rx="12"/>
        <text class="prl" x="185.0" y="134">{{ t('SIM CAMBIADA') }}</text>
        <text class="prt" x="185.0" y="156">{{ t('INGRESA TU PIN') }}</text>
        <circle class="pd" cx="155.0" cy="176" r="4.5"/><circle class="pd" cx="175.0" cy="176" r="4.5"/><circle class="pd" cx="195.0" cy="176" r="4.5"/><circle class="pd" cx="215.0" cy="176" r="4.5"/>
        <rect class="cdt" x="140" y="196" width="90" height="4" rx="2"/>
        <rect class="cdf" x="140" y="196" width="90" height="4" rx="2"/>
      </g>
      <g class="done"><text class="dn" x="185.0" y="174">{{ t('BORRADO') }}</text><line x1="151.0" y1="186" x2="219.0" y2="186"/></g>
    <rect class="slot" x="257" y="122" width="6" height="88" rx="3"/>
    <text class="tag1 t-a" x="300" y="246">SIM 1</text><text class="tag1 t-b" x="300" y="246">SIM ?</text>
  </svg>
  <svg :ref="(el) => (scn[2] = el)" class="scn" data-n="2" :viewBox="vb" aria-hidden="true">
    <g class="tower"><path d="M62 420 L92 210 L122 420"/><path d="M71 360 L113 360 M77 310 L107 310 M83 260 L101 260 M71 360 L107 310 M113 360 L77 310 M77 310 L101 260 M107 310 L83 260"/><circle cx="92" cy="202" r="6"/></g><g class="arcs"><path class="arc" style="--d:0.00s" d="M120 170 q18 32 0 64"/><path class="arc" style="--d:0.35s" d="M142 152 q26 50 0 100"/><path class="arc" style="--d:0.70s" d="M164 134 q34 68 0 136"/></g>

      <g class="vib"><path d="M248 150 q-8 30 0 60"/><path d="M236 140 q-12 40 0 80"/><path d="M426 150 q8 30 0 60"/><path d="M438 140 q12 40 0 80"/></g>
      <rect class="ph" x="262" y="40" width="150" height="290" rx="26"/>
      <line class="notch" x1="321.0" y1="56" x2="353.0" y2="56"/>
      <g class="apps"><rect class="px" style="--d:0.00s" x="284" y="110" width="28" height="28" rx="7"/><rect class="px" style="--d:0.04s" x="322" y="110" width="28" height="28" rx="7"/><rect class="px" style="--d:0.08s" x="360" y="110" width="28" height="28" rx="7"/><rect class="px" style="--d:0.12s" x="284" y="148" width="28" height="28" rx="7"/><rect class="px" style="--d:0.16s" x="322" y="148" width="28" height="28" rx="7"/><rect class="px" style="--d:0.00s" x="360" y="148" width="28" height="28" rx="7"/><rect class="px" style="--d:0.04s" x="284" y="186" width="28" height="28" rx="7"/><rect class="px" style="--d:0.08s" x="322" y="186" width="28" height="28" rx="7"/><rect class="px" style="--d:0.12s" x="360" y="186" width="28" height="28" rx="7"/></g>
      <g class="pr">
        <rect class="prb" x="276" y="126" width="122" height="104" rx="12"/>
        <text class="prl" x="337.0" y="150">{{ t('SIN SEÑAL') }}</text>
        <text class="prt" x="337.0" y="172">{{ t('INGRESA TU PIN') }}</text>
        <circle class="pd" cx="307.0" cy="192" r="4.5"/><circle class="pd" cx="327.0" cy="192" r="4.5"/><circle class="pd" cx="347.0" cy="192" r="4.5"/><circle class="pd" cx="367.0" cy="192" r="4.5"/>
        <rect class="cdt" x="292" y="212" width="90" height="4" rx="2"/>
        <rect class="cdf" x="292" y="212" width="90" height="4" rx="2"/>
      </g>
      <g class="done"><text class="dn" x="337.0" y="190">{{ t('BORRADO') }}</text><line x1="303.0" y1="202" x2="371.0" y2="202"/></g>
    <g class="bars"><rect class="bar" x="284" y="70" width="4" height="4" rx="1"/><rect class="bar" x="291" y="67" width="4" height="7" rx="1"/><rect class="bar" x="298" y="64" width="4" height="10" rx="1"/><rect class="bar" x="305" y="61" width="4" height="13" rx="1"/></g>
    <g class="pouch"><path d="M236 34 H430 a10 10 0 0 1 10 10 V 352 a22 22 0 0 1 -22 22 H 258 a22 22 0 0 1 -22 -22 Z"/><line x1="236" y1="58" x2="440" y2="58"/></g>
    <text class="pl" x="338" y="404">{{ t('BOLSA INHIBIDORA') }}</text>
  </svg>
  <svg :ref="(el) => (scn[3] = el)" class="scn" data-n="3" :viewBox="vb" aria-hidden="true">
    <g class="ticks"><line class="tk big" style="--k:0" x1="260.0" y1="34.0" x2="260.0" y2="54.0"/><line class="tk" style="--k:1" x1="280.5" y1="35.1" x2="279.2" y2="47.0"/><line class="tk" style="--k:2" x1="300.8" y1="38.3" x2="298.3" y2="50.0"/><line class="tk" style="--k:3" x1="320.6" y1="43.6" x2="316.9" y2="55.0"/><line class="tk" style="--k:4" x1="339.7" y1="50.9" x2="334.8" y2="61.9"/><line class="tk big" style="--k:5" x1="358.0" y1="60.3" x2="348.0" y2="77.6"/><line class="tk" style="--k:6" x1="375.2" y1="71.4" x2="368.2" y2="81.1"/><line class="tk" style="--k:7" x1="391.1" y1="84.3" x2="383.1" y2="93.3"/><line class="tk" style="--k:8" x1="405.7" y1="98.9" x2="396.7" y2="106.9"/><line class="tk" style="--k:9" x1="418.6" y1="114.8" x2="408.9" y2="121.8"/><line class="tk big" style="--k:10" x1="429.7" y1="132.0" x2="412.4" y2="142.0"/><line class="tk" style="--k:11" x1="439.1" y1="150.3" x2="428.1" y2="155.2"/><line class="tk" style="--k:12" x1="446.4" y1="169.4" x2="435.0" y2="173.1"/><line class="tk" style="--k:13" x1="451.7" y1="189.2" x2="440.0" y2="191.7"/><line class="tk" style="--k:14" x1="454.9" y1="209.5" x2="443.0" y2="210.8"/><line class="tk big" style="--k:15" x1="456.0" y1="230.0" x2="436.0" y2="230.0"/><line class="tk" style="--k:16" x1="454.9" y1="250.5" x2="443.0" y2="249.2"/><line class="tk" style="--k:17" x1="451.7" y1="270.8" x2="440.0" y2="268.3"/><line class="tk" style="--k:18" x1="446.4" y1="290.6" x2="435.0" y2="286.9"/><line class="tk" style="--k:19" x1="439.1" y1="309.7" x2="428.1" y2="304.8"/><line class="tk big" style="--k:20" x1="429.7" y1="328.0" x2="412.4" y2="318.0"/><line class="tk" style="--k:21" x1="418.6" y1="345.2" x2="408.9" y2="338.2"/><line class="tk" style="--k:22" x1="405.7" y1="361.1" x2="396.7" y2="353.1"/><line class="tk" style="--k:23" x1="391.1" y1="375.7" x2="383.1" y2="366.7"/><line class="tk" style="--k:24" x1="375.2" y1="388.6" x2="368.2" y2="378.9"/><line class="tk big" style="--k:25" x1="358.0" y1="399.7" x2="348.0" y2="382.4"/><line class="tk" style="--k:26" x1="339.7" y1="409.1" x2="334.8" y2="398.1"/><line class="tk" style="--k:27" x1="320.6" y1="416.4" x2="316.9" y2="405.0"/><line class="tk" style="--k:28" x1="300.8" y1="421.7" x2="298.3" y2="410.0"/><line class="tk" style="--k:29" x1="280.5" y1="424.9" x2="279.2" y2="413.0"/><line class="tk big" style="--k:30" x1="260.0" y1="426.0" x2="260.0" y2="406.0"/><line class="tk" style="--k:31" x1="239.5" y1="424.9" x2="240.8" y2="413.0"/><line class="tk" style="--k:32" x1="219.2" y1="421.7" x2="221.7" y2="410.0"/><line class="tk" style="--k:33" x1="199.4" y1="416.4" x2="203.1" y2="405.0"/><line class="tk" style="--k:34" x1="180.3" y1="409.1" x2="185.2" y2="398.1"/><line class="tk big" style="--k:35" x1="162.0" y1="399.7" x2="172.0" y2="382.4"/><line class="tk" style="--k:36" x1="144.8" y1="388.6" x2="151.8" y2="378.9"/><line class="tk" style="--k:37" x1="128.9" y1="375.7" x2="136.9" y2="366.7"/><line class="tk" style="--k:38" x1="114.3" y1="361.1" x2="123.3" y2="353.1"/><line class="tk" style="--k:39" x1="101.4" y1="345.2" x2="111.1" y2="338.2"/><line class="tk big" style="--k:40" x1="90.3" y1="328.0" x2="107.6" y2="318.0"/><line class="tk" style="--k:41" x1="80.9" y1="309.7" x2="91.9" y2="304.8"/><line class="tk" style="--k:42" x1="73.6" y1="290.6" x2="85.0" y2="286.9"/><line class="tk" style="--k:43" x1="68.3" y1="270.8" x2="80.0" y2="268.3"/><line class="tk" style="--k:44" x1="65.1" y1="250.5" x2="77.0" y2="249.2"/><line class="tk big" style="--k:45" x1="64.0" y1="230.0" x2="84.0" y2="230.0"/><line class="tk" style="--k:46" x1="65.1" y1="209.5" x2="77.0" y2="210.8"/><line class="tk" style="--k:47" x1="68.3" y1="189.2" x2="80.0" y2="191.7"/><line class="tk" style="--k:48" x1="73.6" y1="169.4" x2="85.0" y2="173.1"/><line class="tk" style="--k:49" x1="80.9" y1="150.3" x2="91.9" y2="155.2"/><line class="tk big" style="--k:50" x1="90.3" y1="132.0" x2="107.6" y2="142.0"/><line class="tk" style="--k:51" x1="101.4" y1="114.8" x2="111.1" y2="121.8"/><line class="tk" style="--k:52" x1="114.3" y1="98.9" x2="123.3" y2="106.9"/><line class="tk" style="--k:53" x1="128.9" y1="84.3" x2="136.9" y2="93.3"/><line class="tk" style="--k:54" x1="144.8" y1="71.4" x2="151.8" y2="81.1"/><line class="tk big" style="--k:55" x1="162.0" y1="60.3" x2="172.0" y2="77.6"/><line class="tk" style="--k:56" x1="180.3" y1="50.9" x2="185.2" y2="61.9"/><line class="tk" style="--k:57" x1="199.4" y1="43.6" x2="203.1" y2="55.0"/><line class="tk" style="--k:58" x1="219.2" y1="38.3" x2="221.7" y2="50.0"/><line class="tk" style="--k:59" x1="239.5" y1="35.1" x2="240.8" y2="47.0"/></g>
    <circle class="trk" cx="260" cy="230" r="158"/>
    <circle class="tarc" cx="260" cy="230" r="158" pathLength="1000" transform="rotate(-90 260 230)"/>
    <circle class="tdot" cx="260" cy="72" r="6"/>
    <g class="tin">
      <text class="tlab" x="260" y="178">{{ t('TEMPORIZADOR') }}</text>
      <text class="tnum" x="260" y="248" id="tnum">{{ tnum }}</text>
      <g class="ask"><rect x="196" y="276" width="128" height="34" rx="17"/><text x="260" y="298">{{ t('INGRESA TU PIN') }}</text></g>
    </g>
    <g class="done t"><text class="dn" x="260" y="240">{{ t('BORRADO') }}</text><line x1="220" y1="256" x2="300" y2="256"/></g>
  </svg>
      </div>
      <ol class="steps" aria-hidden="true"><li class="st st1"><b>01</b>{{ t('Detecta') }}</li><li class="st st2"><b>02</b>{{ t('Suena y vibra') }}</li><li class="st st3"><b>03</b>{{ t('Sin PIN, se borra') }}</li></ol>
    </div>
  </div>
</section>
</template>

<style scoped>
.pills{position:absolute;display:flex;gap:12px;align-items:center}
.pill{display:flex;align-items:center;gap:10px;padding:12px 22px 12px 18px;border-radius:999px;background:rgba(var(--rgb-white),.05);border:1px solid rgba(var(--rgb-ice),.28);font:500 14px/20px var(--font-sans);color:var(--color-ice);white-space:nowrap;transition:background .3s,color .3s,box-shadow .3s,transform .25s}
.pill .ico{width:22px;height:22px}
.pill:hover{transform:translateY(-2px);border-color:rgba(var(--rgb-ice),.6)}
.pill.on{background:var(--color-signal);border-color:var(--color-signal);color:var(--color-ink);box-shadow:0 0 24px rgba(var(--rgb-signal),.5)}
.content05{position:absolute;display:flex;flex-direction:column;gap:14px}
.content05 .sw{transition:opacity .3s,transform .3s}
.content05.out h3,.content05.out p{opacity:0;transform:translateY(8px)}
.content05 h3,.content05 p{transition:opacity .35s var(--ease),transform .35s var(--ease)}
.stage05{position:absolute;width:520px;height:620px}
.shead{position:absolute;left:0;right:0;top:0;height:32px;display:flex;align-items:center;justify-content:space-between}
.sidx{color:var(--color-ice);transition:opacity .25s}
.stag{font:700 12px/16px var(--font-mono);letter-spacing:1px;text-transform:uppercase;color:var(--color-alert);padding:7px 14px;border-radius:999px;border:1px solid rgba(var(--rgb-alert),.45);background:rgba(var(--rgb-alert),.08)}
.sbox{position:absolute;left:0;top:56px;width:520px;height:460px}
.scn{position:absolute;inset:0;width:520px;height:460px;overflow:hidden;opacity:0;transform:scale(.96);transition:opacity .45s var(--ease),transform .6s var(--ease);fill:none;stroke:#B7D3E7;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.scn.on{opacity:1;transform:none}
.scn text{stroke:none;fill:#B7D3E7;font-family:var(--font-mono);text-anchor:middle}
.steps{position:absolute;left:0;right:0;top:548px;display:flex;gap:10px;list-style:none;margin:0;padding:0}
.st{flex:1;position:relative;padding-top:14px;font:500 12px/16px var(--font-mono);color:var(--color-muted);letter-spacing:.3px;text-transform:uppercase}
.st b{display:block;font-weight:700;color:inherit;margin-bottom:4px}
.st::before,.st::after{content:"";position:absolute;left:0;top:0;height:3px;border-radius:3px}
.st::before{right:0;background:rgba(var(--rgb-ice),.14)}
.st::after{width:0;background:var(--c,#4DF0A4);box-shadow:0 0 10px var(--c,#4DF0A4)}
.st1{--c:#7B8CFF}.st2{--c:#FF5C6C}.st3{--c:#FF5C6C}
.stage05.run .st1::after{animation:stp1 var(--T) linear infinite}
.stage05.run .st2::after{animation:stp2 var(--T) linear infinite}
.stage05.run .st3::after{animation:stp3 var(--T) linear infinite}
.stage05.run .st1{animation:stc1 var(--T) linear infinite}
.stage05.run .st2{animation:stc2 var(--T) linear infinite}
.stage05.run .st3{animation:stc3 var(--T) linear infinite}
.stage05.run .stag{animation:tagf var(--T) linear infinite}
@keyframes stp1{0%{width:0}26%,96%{width:100%}100%{width:0}}
@keyframes stp2{0%,26%{width:0}72%,96%{width:100%}100%{width:0}}
@keyframes stp3{0%,72%{width:0}88%,96%{width:100%}100%{width:0}}
@keyframes stc1{0%,26%{color:#F3F6FB}30%,100%{color:#8E97BF}}
@keyframes stc2{0%,26%{color:#8E97BF}30%,72%{color:#F3F6FB}76%,100%{color:#8E97BF}}
@keyframes stc3{0%,72%{color:#8E97BF}76%,94%{color:#F3F6FB}100%{color:#8E97BF}}
@keyframes tagf{0%,73%{background:rgba(var(--rgb-alert),.08);color:#FF5C6C;box-shadow:none}76%,92%{background:#FF5C6C;color:#0A0F2C;box-shadow:0 0 22px rgba(var(--rgb-alert),.6)}96%,100%{background:rgba(var(--rgb-alert),.08);color:#FF5C6C}}

/* teléfono común (línea Gemini, más rica) */
.scn .ph{fill:#0F1640;stroke-opacity:.55;stroke-width:1.8}
.scn .notch{stroke-opacity:.45;stroke-width:3}
.scn .apps rect{stroke-opacity:.7}
.scn .vib path{stroke:#FF5C6C;stroke-width:2;opacity:0}
.scn .pr{opacity:0}
.scn .prb{stroke:#FF5C6C;fill:rgba(var(--rgb-alert),.07)}
.scn .prl{fill:#FF5C6C!important;font-size:10px;letter-spacing:1.2px;font-weight:700}
.scn .prt{fill:#F3F6FB!important;font-size:11px;font-weight:700;letter-spacing:.5px}
.scn .pd{stroke-width:1.4}
.scn .cdt{stroke:none;fill:rgba(var(--rgb-ice),.18)}
.scn .cdf{stroke:none;fill:#FF5C6C;transform-box:fill-box;transform-origin:left center}
.scn .done{opacity:0}
.scn .done line{stroke:#FF5C6C;stroke-width:2;stroke-dasharray:80;stroke-dashoffset:80}
.scn .dn{fill:#FF5C6C!important;font-size:15px;font-weight:800;letter-spacing:3px}
.scn.run .ph{animation:phA var(--T) var(--ease) infinite}
.scn.run .vib path{animation:vibA var(--T) linear infinite}
.scn.run .vib{animation:shake .12s linear infinite}
.scn.run .pr{animation:prA var(--T) var(--ease) infinite}
.scn.run .pd:nth-of-type(1){animation:pdA var(--T) infinite}
.scn.run .cdf{animation:cdA var(--T) linear infinite}
.scn.run .px{animation:pxA var(--T) var(--ease) infinite;animation-delay:var(--d);transform-box:fill-box;transform-origin:center}
.scn.run .done{animation:dnA var(--T) var(--ease) infinite}
.scn.run .done line{animation:dlA var(--T) var(--ease) infinite}
@keyframes phA{0%,24%{stroke:#B7D3E7;stroke-opacity:.55;filter:none}30%,74%{stroke:#FF5C6C;stroke-opacity:1;filter:drop-shadow(0 0 12px rgba(var(--rgb-alert),.55))}84%,100%{stroke:#B7D3E7;stroke-opacity:.55;filter:none}}
@keyframes vibA{0%,27%{opacity:0}30%,72%{opacity:.9}75%,100%{opacity:0}}
@keyframes shake{0%,100%{transform:translateX(0)}50%{transform:translateX(2px)}}
@keyframes prA{0%,26%{opacity:0;transform:translateY(8px)}30%,72%{opacity:1;transform:none}76%,100%{opacity:0;transform:translateY(-6px)}}
@keyframes pdA{0%,100%{fill:none}}
@keyframes cdA{0%,30%{transform:scaleX(1)}72%,100%{transform:scaleX(0)}}
@keyframes pxA{0%,24%{opacity:1;transform:none;stroke:#B7D3E7}30%,72%{opacity:.14;transform:none}78%{opacity:.9;transform:translateY(-4px) scale(.7);stroke:#FF5C6C}86%,94%{opacity:0;transform:translateY(-22px) scale(.3)}100%{opacity:1;transform:none;stroke:#B7D3E7}}
@keyframes dnA{0%,78%{opacity:0}82%,94%{opacity:1}100%{opacity:0}}
@keyframes dlA{0%,80%{stroke-dashoffset:80}88%,100%{stroke-dashoffset:0}}

/* 0 · cable */
.scn .port{stroke-width:1.4;fill:#0A0F2C}
.scn .cable{stroke-width:3;stroke-opacity:.9}
.scn .cdata{stroke:#FF5C6C;stroke-width:3;stroke-dasharray:10 26;opacity:0}
.scn .pb{fill:#0A0F2C;stroke-width:1.8}
.scn .pt{stroke:#FF5C6C;fill:#0A0F2C}
.scn .spark{stroke:#FF5C6C;stroke-width:2;opacity:0;transform-box:fill-box;transform-origin:center}
.scn.run .plug{animation:plugA var(--T) var(--ease) infinite}
.scn.run .spark{animation:sparkA var(--T) ease-out infinite}
.scn.run .cdata{animation:dataA var(--T) linear infinite}
@keyframes plugA{0%,6%{transform:translateY(90px)}22%,88%{transform:translateY(0)}98%,100%{transform:translateY(90px)}}
@keyframes sparkA{0%,21%{opacity:0;transform:scale(.4)}23%{opacity:1;transform:scale(.6)}36%{opacity:0;transform:scale(3.4)}100%{opacity:0}}
@keyframes dataA{0%,22%{opacity:0;stroke-dashoffset:0}26%{opacity:1}72%{opacity:1;stroke-dashoffset:180}76%,100%{opacity:0;stroke-dashoffset:200}}

/* 1 · SIM */
.scn .tr{fill:#0F1640;stroke-opacity:.8}
.scn .tcut{stroke-dasharray:4 4;stroke-opacity:.5}
.scn .tph{stroke-opacity:.7}
.scn .so path,.scn .sn path{fill:#0A0F2C;stroke-width:1.8}
.scn .sn path{stroke:#FF5C6C}
.scn .sq{fill:#FF5C6C!important;font-size:30px;font-weight:800}
.scn .slot{fill:#0A0F2C;stroke-opacity:.6}
.scn .sn{opacity:0}
.scn .tag1{font-size:12px;letter-spacing:1px;font-weight:700}
.scn .t-b{fill:#FF5C6C!important;opacity:0}
.scn.run .tray{animation:trayA var(--T) var(--ease) infinite}
.scn.run .so{animation:soA var(--T) var(--ease) infinite;transform-box:fill-box;transform-origin:center}
.scn.run .sn{animation:snA var(--T) var(--ease) infinite;transform-box:fill-box;transform-origin:center}
.scn.run .t-a{animation:taA var(--T) infinite}.scn.run .t-b{animation:tbA var(--T) infinite}
@keyframes trayA{0%,4%{transform:translateX(-92px)}14%,90%{transform:translateX(0)}99%,100%{transform:translateX(-92px)}}
@keyframes soA{0%,16%{opacity:1;transform:none}28%,100%{opacity:0;transform:translate(110px,-90px) rotate(24deg)}}
@keyframes snA{0%,20%{opacity:0;transform:translate(110px,-100px) rotate(-20deg)}30%,92%{opacity:1;transform:none}98%,100%{opacity:0;transform:none}}
@keyframes taA{0%,18%{opacity:1}24%,96%{opacity:0}100%{opacity:1}}
@keyframes tbA{0%,22%{opacity:0}28%,94%{opacity:1}100%{opacity:0}}

/* 2 · sin señal */
.scn .tower{stroke-opacity:.8}
.scn .tower circle{fill:#B7D3E7}
.scn .arc{stroke:#4DF0A4;stroke-width:2}
.scn .bar{stroke:none;fill:#B7D3E7;transform-box:fill-box;transform-origin:bottom}
.scn .pouch path{fill:rgba(var(--rgb-ink),.55);stroke-dasharray:8 7;stroke-width:1.8}
.scn .pouch line{stroke-dasharray:3 5;stroke-opacity:.6}
.scn .pl{font-size:11px;letter-spacing:1.2px;opacity:0}
.scn.run .arc{animation:arcA 1.2s ease-out infinite;animation-delay:var(--d)}
.scn.run .arcs{animation:arcsA var(--T) var(--ease) infinite}
.scn.run .pouch{animation:pouchA var(--T) var(--ease) infinite}
.scn.run .bar{animation:barA var(--T) var(--ease) infinite}
.scn.run .bar:nth-child(3){animation-delay:.08s}.scn.run .bar:nth-child(2){animation-delay:.16s}.scn.run .bar:nth-child(1){animation-delay:.24s}
.scn.run .pl{animation:plA var(--T) infinite}
@keyframes arcA{0%{opacity:0;transform:translateX(-6px)}30%{opacity:1}100%{opacity:0;transform:translateX(26px)}}
@keyframes arcsA{0%,16%{opacity:1;filter:none}24%,90%{opacity:.35;filter:grayscale(1)}100%{opacity:1}}
@keyframes pouchA{0%,6%{transform:translateY(-440px)}20%,90%{transform:translateY(0)}99%,100%{transform:translateY(-440px)}}
@keyframes barA{0%,18%{transform:scaleY(1);fill:#B7D3E7}26%,90%{transform:scaleY(.2);fill:#FF5C6C}100%{transform:scaleY(1);fill:#B7D3E7}}
@keyframes plA{0%,18%{opacity:0}24%,90%{opacity:.8}100%{opacity:0}}

/* 3 · temporizador */
.scn .tk{stroke-opacity:.25;stroke-width:1.4}
.scn .tk.big{stroke-opacity:.6;stroke-width:2}
.scn .trk{stroke-opacity:.16;stroke-width:6}
.scn .tarc{stroke:#FF5C6C;stroke-width:6;stroke-dasharray:1000;stroke-dashoffset:0;filter:drop-shadow(0 0 10px rgba(var(--rgb-alert),.7))}
.scn .tdot{fill:#FF5C6C;stroke:none;transform-origin:260px 230px}
.scn .tlab{font-size:12px;letter-spacing:2px;font-weight:700;fill:#8E97BF!important}
.scn .tnum{font-size:60px;font-weight:800;letter-spacing:-1px;fill:#F3F6FB!important}
.scn .ask{opacity:0}
.scn .ask rect{stroke:#FF5C6C;fill:rgba(var(--rgb-alert),.08)}
.scn .ask text{fill:#FF5C6C!important;font-size:11px;font-weight:700;letter-spacing:1px}
.scn .done.t .dn{font-size:22px}
.scn.run .tarc{animation:tarcA var(--T) linear infinite}
.scn.run .tdot{animation:tdotA var(--T) linear infinite}
.scn.run .ask{animation:prA var(--T) var(--ease) infinite}
.scn.run .tin{animation:tinA var(--T) var(--ease) infinite}
.scn.run .ticks{animation:tickA var(--T) linear infinite}
@keyframes tarcA{0%,6%{stroke-dashoffset:0}74%,94%{stroke-dashoffset:1000}100%{stroke-dashoffset:0}}
@keyframes tdotA{0%,6%{transform:rotate(0)}74%,94%{transform:rotate(-360deg)}100%{transform:rotate(0)}}
@keyframes tinA{0%,74%{opacity:1}78%,94%{opacity:0}100%{opacity:1}}
@keyframes tickA{0%,72%{opacity:1}80%,94%{opacity:.25}100%{opacity:1}}
@media (prefers-reduced-motion:reduce){.scn *,.stage05 *{animation:none!important}.scn .pr{opacity:1}}

@media (max-width:1023px){
  .pills{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 calc(var(--pad) * -1)!important;max-width:none!important;padding:4px var(--pad) 14px;scroll-snap-type:x proximity}
  .pills::-webkit-scrollbar{display:none}
  .pill{scroll-snap-align:start}
  .content05{margin-top:16px;min-height:196px}
  .stage05{height:auto!important;margin-top:8px}
  .stage05::before{content:"";position:absolute;left:50%;top:44%;width:120%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(var(--rgb-alert),.26),rgba(var(--rgb-alert),0));pointer-events:none}
  .shead{position:relative;gap:12px}
  .sbox{position:relative;top:auto;width:100%;height:auto;aspect-ratio:440/428;margin-top:12px}
  .scn{width:100%;height:100%}
  .steps{position:relative;top:auto;margin-top:16px;gap:8px}
  .st{font-size:11px;line-height:15px;letter-spacing:0}

  .content05{min-height:164px;margin-top:12px}
  .stage05{margin-top:0}
  .pill{touch-action:manipulation}
}
@media (max-width:1023px){
  .pills{gap:8px;align-items:stretch;scroll-snap-type:x mandatory;scroll-padding-inline:var(--pad);overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;padding:6px var(--pad) 12px!important}
  .pills::after{content:"";flex:0 0 1px}
  .pill{flex:none;height:44px;padding:0 16px 0 14px;gap:8px;font-size:14px;line-height:20px;scroll-snap-align:start;transform:none!important}
  .pill .ico{width:18px;height:18px}
  .pill.on{box-shadow:0 0 16px rgba(var(--rgb-signal),.45)}
}
@media (hover:none){.pill:hover{transform:none;border-color:rgba(var(--rgb-ice),.28)}.pill.on:hover{border-color:var(--color-signal)}}
</style>
