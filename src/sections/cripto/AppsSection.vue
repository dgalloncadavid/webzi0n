<script setup>
/* Cripto · apps compatibles: chips que entran en cascada y flotan. */
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const apps = [['MM', 'MetaMask'], ['TW', 'Trust Wallet'], ['PH', 'Phantom'], ['RB', 'Rabby'], ['EX', 'Exodus'], ['UN', 'Uniswap'], ['MO', 'Monero'], ['TL', 'TronLink']]
</script>

<template>
<section class="sec" id="apps" :aria-label="t('Aplicaciones')">
  <div class="wrap">
    <SectionHeader v-reveal class="rv" :title="t('Las apps que ya usas')" :lead="t('MetaMask, Trust Wallet, Phantom, Rabby, Exodus, Uniswap, Monero, TronLink y más desde la tienda de Zi0n.')" />
    <div v-reveal class="chips" id="chips">
      <span v-for="(a, i) in apps" :key="a[1]" class="achip" :style="'--i:' + i"><b>{{ a[0] }}</b>{{ a[1] }}</span>
      <span class="achip more" style="--i:8"><b>+</b>{{ t('y más') }}</span>
    </div>
  </div>
</section>
</template>

<style scoped>
.chips{display:flex;flex-wrap:wrap;justify-content:center;gap:var(--zn-space-16);max-width:1040px;margin:0 auto}
.achip{display:inline-flex;align-items:center;gap:var(--zn-space-12);padding:var(--zn-space-8) var(--zn-space-20) var(--zn-space-8) var(--zn-space-8);border-radius:var(--radius-pill);background:var(--color-glass);border:1px solid var(--color-line);font:var(--zn-weight-medium) 14px/20px var(--font-sans);color:var(--color-mist);transition:border-color var(--dur-medium),box-shadow var(--dur-medium),transform var(--dur-medium) var(--ease)}
.achip b{width:32px;height:32px;border-radius:var(--radius-round);display:grid;place-items:center;background:rgba(var(--rgb-aurora),.16);font:var(--zn-weight-medium) 13px/20px var(--font-mono);color:var(--color-mist)}
.achip:hover{transform:translateY(-3px);border-color:rgba(var(--rgb-signal),.6);box-shadow:0 0 22px rgba(var(--rgb-signal),.25)}
.achip:hover b{background:rgba(var(--rgb-signal),.2)}
.chips .achip{opacity:0;transform:translateY(12px) scale(.94);transition:opacity var(--zn-dur-500) var(--ease) calc(var(--i)*.06s),transform var(--zn-dur-500) var(--ease) calc(var(--i)*.06s),border-color var(--dur-medium),box-shadow var(--dur-medium)}
.chips.in .achip{opacity:1;transform:none}
.chips.in .achip{animation:bob 6s var(--zn-ease-in-out) calc(var(--i)*-.7s) infinite}
@keyframes bob{0%,100%{translate:0 0}50%{translate:0 -4px}}
@media (max-width:640px){
  .chips{gap:var(--zn-space-10)}
  .achip{padding:var(--zn-space-6) var(--zn-space-16) var(--zn-space-6) var(--zn-space-6)}
}
@media (hover:none){.achip:hover{transform:none}}
@media (prefers-reduced-motion:reduce){
  .chips .achip{opacity:1;transform:none}
}
</style>
