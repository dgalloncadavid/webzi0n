<script setup>
/* Inicio · elige tu camino: dos tarjetas hacia GrapheneOS y Cripto, y atajo a la compra. */
import { RouterLink } from 'vue-router'
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import RouteCard from '@/design-system/components/RouteCard.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
</script>

<template>
<section class="sec" id="caminos" aria-labelledby="c-t">
  <div class="wrap">
    <SectionHeader v-reveal class="rv" :eyebrow="t('Elige tu camino')" :title="t('¿Ya tienes claro lo tuyo?')" title-id="c-t" :lead="t('Si vienes de GrapheneOS o manejas cripto, tenemos una página pensada para tu caso.')" />
    <div class="routes">
      <RouteCard v-reveal class="rv" to="/grapheneos" tone="aurora" :tags="[t('Pixel'), 'GrapheneOS']" :eyebrow="t('Para usuarios de GrapheneOS')" :title="t('Tu GrapheneOS, con red de seguridad')" :text="t('Si ya confías en GrapheneOS en tu Pixel, Zi0n suma avisos, borrado automático y una capa oculta encima de lo que tienes.')" :items="[t('Se instala sobre tu sistema actual'), t('Borrado ante cable, cambio de SIM o falta de señal'), t('Capa oculta para tus apps más sensibles')]" :cta-label="t('Ver Zi0n para GrapheneOS')" />
      <RouteCard v-reveal class="rv" to="/cripto" tone="signal" style="--d:.1s" :tags="['Wallets', 'Web3', 'Stablecoins']" :eyebrow="t('Para quien maneja cripto')" :title="t('Tus wallets en una capa que nadie ve')" :text="t('Guarda wallets y exchanges en la capa oculta. Si alguien revisa tu teléfono, solo verá apps comunes.')" :items="[t('Tienda con apps Web3 y de exchange'), t('Widget de precios dentro de la capa oculta'), t('Pagas con USDT o USDC')]" :cta-label="t('Ver Zi0n Cripto')" />
    </div>
    <p v-reveal class="shortcut rv">{{ t('¿Ya sabes lo que quieres?') }} <RouterLink to="/compra">{{ t('Ir directo a comprar') }} <span class="ico"><Icon name="arrow-right" /></span></RouterLink></p>
  </div>
</section>
</template>

<style scoped>
.routes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--zn-space-24)}
.shortcut{display:flex;justify-content:center;align-items:center;gap:var(--zn-space-12);flex-wrap:wrap;margin-top:var(--zn-space-40);font:var(--zn-weight-regular) 16px/24px var(--font-sans);color:var(--color-ice)}
.shortcut a{display:inline-flex;align-items:center;gap:var(--zn-space-8);font-weight:var(--zn-weight-medium);color:var(--color-signal)}
.shortcut a .ico{width:18px;height:18px;transition:transform var(--dur-medium) var(--ease)}
.shortcut a:hover .ico{transform:translateX(4px)}
@media (max-width:1023px){
  .routes{grid-template-columns:1fr}
}
@media (max-width:640px){
  .shortcut{flex-direction:column;gap:var(--zn-space-4);margin-top:var(--zn-space-28)}
}
</style>
