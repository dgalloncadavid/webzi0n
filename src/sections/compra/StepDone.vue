<script setup>
/* Checkout · pantalla final: check animado, resumen en píldoras y próximos pasos. */
import { asset } from '@/design-system/asset'
import { inject, computed } from 'vue'
import Button from '@/design-system/components/Button.vue'
import StepCard from '@/design-system/components/StepCard.vue'
import { useT } from '@/design-system/composables/useLang'
import { TIPOS, STORE_NAMES, skipStore, money } from './order'

const { t, fmt } = useT()
const c = inject('checkout')
const receipt = computed(() => {
  const S = c.S
  const it = [t(TIPOS[S.tipo] || '')]
  if (!skipStore(S) && S.tienda) it.push(t(STORE_NAMES[S.tienda]))
  it.push(S.tipo === 'prueba' ? t('15 días') : fmt('{d} días', { d: S.plan }))
  it.push(money(S, t))
  return it
})
const NEXT = [
  ['Abre el correo de Zi0n', 'Si no lo ves en unos minutos, revisa la carpeta de spam.'],
  ['Escanea el QR', 'Hazlo desde el celular que vas a proteger.'],
  ['Configura tu PIN de seguridad', 'Con él entras a Zi0n cada vez que lo necesites.']
]
</script>

<template>
      <div class="step done" data-step="5">
        <div class="done-phones" aria-hidden="true"><img :src="asset('assets/compra/phones.png')" width="432" height="190" alt=""></div>
        <div class="okmark" aria-hidden="true"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="36"/><path d="M25 41l10 10 20-22"/></svg><i></i><i></i></div>
        <h2 class="h2" id="doneT">{{ t(c.S.tipo === 'prueba' ? '¡Tu prueba está lista! Revisa tu correo' : '¡Listo! Revisa tu correo') }}</h2>
        <p class="lead">{{ t('Enviamos tu código QR de instalación a') }} <b class="em-echo">{{ c.S.email }}</b>.</p>
        <div class="receipt" id="receipt" :aria-label="t('Resumen de la compra')"><span v-for="(x, i) in receipt" :key="i" :class="{ rt: i === receipt.length - 1 }">{{ x }}</span></div>
        <ol class="next3">
          <StepCard v-for="(n, i) in NEXT" :key="i" variant="compact" :number="i + 1" :title="t(n[0])" :text="t(n[1])" />
        </ol>
        <div class="actions">
          <Button size="xl" variant="ghost" id="resend" @click="c.resend()">{{ t('Reenviar correo') }}</Button>
          <Button to="/" size="xl" variant="primary">{{ t('Volver a Zi0n') }}</Button>
        </div>
      </div>
</template>

<style scoped>
.done{align-items:center;text-align:center;padding:12px 0;gap:18px;max-width:640px;width:100%}
.okmark{position:relative;width:104px;height:104px;margin:-40px 0 0;z-index:1;border-radius:var(--radius-round);background:var(--zn-okmark);box-shadow:0 0 0 8px rgba(var(--zn-okmark-rgb),.9)}
.okmark svg{width:100%;height:100%;fill:none;stroke-linecap:round;stroke-linejoin:round}
.okmark circle{stroke:var(--color-signal);stroke-width:3;stroke-dasharray:230;stroke-dashoffset:230;animation:draw 1s var(--ease) .1s forwards;filter:drop-shadow(0 0 10px rgba(var(--rgb-signal),.7))}
.okmark path{stroke:var(--color-signal);stroke-width:5;stroke-dasharray:60;stroke-dashoffset:60;animation:draw .6s var(--ease) .8s forwards}
.okmark i{position:absolute;inset:0;border-radius:var(--radius-round);border:2px solid var(--color-signal);opacity:0;animation:ring 1.6s var(--zn-ease-out) 1s 2}
.okmark i+i{animation-delay:1.4s}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes ring{0%{transform:scale(.8);opacity:.8}100%{transform:scale(2);opacity:0}}
.next3{display:flex;flex-direction:column;gap:var(--zn-space-10);width:100%;max-width:560px;margin:12px 0 4px;text-align:left}
.done .actions{width:100%;max-width:560px;justify-content:center}
.done .actions .btn{flex:1}
.done .h2{font-size:38px;line-height:46px;letter-spacing:-1px}
.done .lead{font-size:18px;line-height:28px}
.done-phones{width:min(100%,420px);margin:-8px auto 0;opacity:.95;-webkit-mask-image:linear-gradient(180deg,#000 55%,transparent);mask-image:linear-gradient(180deg,#000 55%,transparent);animation:rise .9s var(--ease) .2s both}
.done-phones img{width:100%;height:auto}
@keyframes rise{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}
.receipt{display:flex;flex-wrap:wrap;justify-content:center;gap:var(--zn-space-8)}
.receipt span{padding:6px 12px;border-radius:var(--radius-pill);background:var(--color-glass-checkout);border:1px solid var(--color-line);font:var(--zn-weight-medium) 13px/18px var(--font-sans);color:var(--color-ice)}
.receipt .rt{background:rgba(var(--rgb-signal),.14);border-color:rgba(var(--rgb-signal),.5);color:var(--color-mist);font-family:var(--font-mono);font-weight:var(--zn-weight-extrabold)}
@media (max-width:640px){
  .done .h2{font-size:28px;line-height:35px}
  .done .lead{font-size:16px;line-height:25px}
  .done .actions{flex-direction:column-reverse}
}
@media (prefers-reduced-motion:reduce){.okmark circle,.okmark path{stroke-dashoffset:0}}
</style>
