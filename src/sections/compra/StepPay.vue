<script setup>
/* Checkout · paso 4: método de pago (o confirmación de la prueba, que no paga). */
import { asset } from '@/design-system/asset'
import { inject } from 'vue'
import PaymentMethod from '@/design-system/components/PaymentMethod.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const c = inject('checkout')
</script>

<template>
      <div class="step" data-step="4">
        <p class="kicker kick" data-k="4">{{ c.kick(4) }}</p>
        <h2 class="h2" id="h4t">{{ t(c.S.tipo === 'prueba' ? 'Confirma tu prueba' : '¿Cómo quieres pagar?') }}</h2>

        <div id="payArea" :hidden="c.S.tipo === 'prueba'">
          <div class="methods" role="radiogroup" :aria-label="t('Método de pago')">
            <PaymentMethod v-model="c.S.metodo" value="crypto" :title="t('Stablecoins')" :text="t('USDT o USDC · procesado por Cryptomus')" :logos="[{ src: asset('assets/compra/usdt.png'), width: 24, height: 24, alt: 'USDT' }, { src: asset('assets/compra/usdc.png'), width: 24, height: 24, alt: 'USDC' }]" />
            <PaymentMethod v-model="c.S.metodo" value="card" cards :title="t('Tarjeta de crédito')" :text="t('Visa, Mastercard o Amex · procesado por Stripe')" :logos="[{ src: asset('assets/compra/visa.png'), width: 46, height: 15, alt: 'Visa' }, { src: asset('assets/compra/mastercard.png'), width: 26, height: 16, alt: 'Mastercard' }, { src: asset('assets/compra/amex.png'), width: 22, height: 22, alt: 'American Express' }]" />
          </div>
          <p class="next-note" id="nextNote" :hidden="!(c.cur === 4 && c.S.tipo !== 'prueba' && c.S.metodo)"><span class="ico"><Icon name="external-link" /></span><span id="nextNoteT">{{ c.S.metodo ? t(c.S.metodo === 'crypto' ? 'Te llevaremos a la página de pago de Cryptomus para enviar USDT o USDC.' : 'Te llevaremos a la página de pago con tarjeta, procesada por Stripe.') : '' }}</span></p>
        </div>
        <div class="pane" id="paneTrial" :hidden="c.S.tipo !== 'prueba'">
          <div class="trialbox"><span class="ico"><Icon name="gift" /></span><div><b>{{ t('Tu prueba no requiere pago') }}</b><p>{{ t('Te enviaremos el QR de instalación a') }} <b class="em-echo">{{ c.S.email }}</b>.</p></div></div>
        </div>
      </div>
</template>

<style scoped>
.methods{display:grid;gap:var(--zn-space-10);margin-top:var(--zn-space-4)}
.next-note{display:flex;gap:var(--zn-space-10);align-items:center;margin-top:var(--zn-space-12);font:var(--zn-weight-regular) 14px/20px var(--font-sans);color:var(--color-ice)}
.next-note .ico{width:18px;height:18px;color:var(--color-signal)}
</style>
