<script setup>
/* Cripto · el dilema: hardware wallet, Zi0n y hot wallet, con medidores. */
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import Card from '@/design-system/components/Card.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const cards = [
  { d: '0s', tone: 'c-aur', icon: 'wallet', title: 'Hardware wallet', text: 'Excelente para guardar en frío. Pero no sale contigo a la calle ni sirve para operar a diario.', v: ['.95', '.2'] },
  { d: '.1s', tone: 'c-sig', icon: 'shield-lock', title: 'Zi0n', text: 'Tus wallets de siempre, en tiempo real, dentro de una capa oculta que se borra si alguien intenta forzarla.', v: ['.85', '.9'], z: true },
  { d: '.2s', tone: 'c-aur', icon: 'device-mobile', title: 'Hot wallet en un celular normal', text: 'Cómodo, pero un robo o un desbloqueo forzado queda a un paso de tus fondos.', v: ['.25', '.95'] }
]
</script>

<template>
<section class="sec" id="dilema" :aria-label="t('El dilema')">
  <div class="wrap">
    <SectionHeader v-reveal class="rv" :title="t('La seguridad cripto siempre te pidió elegir')" />
    <div class="grid3 dilemma">
      <Card v-for="c in cards" :key="c.title" v-reveal class="dcard rv" :class="{ zcard: c.z }" :style="'--d:' + c.d">
        <span class="ibadge" :class="c.tone"><span class="ico"><Icon :name="c.icon" /></span></span>
        <h3 class="h5">{{ t(c.title) }}</h3>
        <p class="small">{{ t(c.text) }}</p>
        <div class="meter"><span class="ml">{{ t('Guardar') }}</span><i :style="'--v:' + c.v[0]"></i><span class="ml">{{ t('Operar a diario') }}</span><i :style="'--v:' + c.v[1]"></i></div>
      </Card>
    </div>
  </div>
</section>
</template>

<style scoped>
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--zn-space-24)}
.dcard{display:flex;flex-direction:column;gap:var(--zn-space-12)}
.ibadge{width:40px;height:40px;border-radius:var(--radius-round);display:grid;place-items:center;background:rgba(var(--rgb),.16);color:rgb(var(--rgb));flex:none;transition:transform var(--zn-dur-400) var(--ease),box-shadow var(--zn-dur-400)}
.ibadge .ico{width:22px;height:22px}
.card:hover .ibadge{transform:scale(1.08) rotate(-4deg);box-shadow:0 0 20px rgba(var(--rgb),.45)}
.zcard{background:linear-gradient(160deg,var(--zn-card-featured-from),var(--color-navy));border-color:transparent;transform:translateY(-10px);box-shadow:0 24px 60px -20px rgba(var(--rgb-signal),.35)}
.zcard::before{content:"";position:absolute;inset:-1px;border-radius:var(--zn-radius-25);padding:1.5px;background:conic-gradient(from var(--ang,0deg),rgba(var(--rgb-signal),.95),rgba(var(--rgb-aurora),.6),rgba(var(--rgb-signal),.15),rgba(var(--rgb-signal),.95));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:spin 6s linear infinite;pointer-events:none}
@property --ang{syntax:'<angle>';inherits:false;initial-value:0deg}
@keyframes spin{to{--ang:360deg}}
.zcard:hover{transform:translateY(-14px)}
.zcard .ibadge{animation:shieldp 3s var(--zn-ease-in-out) infinite}
@keyframes shieldp{0%,100%{box-shadow:0 0 0 rgba(77,240,164,0)}50%{box-shadow:0 0 22px rgba(77,240,164,.55)}}
.zcard .small{color:var(--color-mist)}
.meter{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:var(--zn-space-8) var(--zn-space-12);margin-top:auto;padding-top:var(--zn-space-12);border-top:1px solid var(--color-line)}
.ml{font:var(--zn-weight-medium) 11px/14px var(--font-mono);letter-spacing:.6px;text-transform:uppercase;color:var(--color-muted)}
.meter i{position:relative;height:6px;border-radius:6px;background:rgba(var(--rgb-ice),.12);overflow:hidden}
.meter i::after{content:"";position:absolute;inset:0;border-radius:6px;background:linear-gradient(90deg,var(--color-aurora),var(--color-signal));transform:scaleX(0);transform-origin:left;transition:transform var(--zn-dur-1200) var(--ease) .4s}
.dcard.in .meter i::after{transform:scaleX(var(--v))}
.dcard:not(.zcard) .meter i::after{background:linear-gradient(90deg,var(--zn-meter-from),var(--color-aurora))}
@media (max-width:1023px){
  .grid3{grid-template-columns:1fr;max-width:560px;margin:0 auto}
  .zcard{transform:none}.zcard:hover{transform:translateY(-4px)}
}
</style>
