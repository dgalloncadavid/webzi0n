<script setup>
/* Checkout · paso 3: duración del plan (o aviso de prueba) y correo para el QR. */
import { inject } from 'vue'
import RadioCard from '@/design-system/components/RadioCard.vue'
import TextField from '@/design-system/components/TextField.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const c = inject('checkout')
const PLANS = [
  { value: '90', title: '90 días', price: '$150', day: '$1,67 al día' },
  { value: '180', title: '180 días', price: '$269', day: '$1,49 al día', tag: 'Ahorras 10%' },
  { value: '360', title: '360 días', price: '$500', day: '$1,39 al día', tag: 'Ahorras 17%' }
]
function onEnter(e) { if (e.key === 'Enter') { e.preventDefault(); c.next() } }
</script>

<template>
      <div class="step" data-step="3">
        <p class="kicker kick" data-k="3">{{ c.kick(3) }}</p>
        <h2 class="h2" id="h3t">{{ t(c.S.tipo === 'prueba' ? 'Tu prueba y tu correo' : 'Plan y correo') }}</h2>
        <div class="plans" id="plans" role="radiogroup" :aria-label="t('Duración de la licencia')" :hidden="c.S.tipo === 'prueba'">
          <RadioCard v-for="p in PLANS" :key="p.value" v-model="c.S.plan" variant="plan" name="plan" :value="p.value" :title="t(p.title)" :price="p.price" currency="USD" :text="t(p.day)" :tag="p.tag ? { label: t(p.tag), tone: 'amber' } : null" />
        </div>
        <div class="trialbox" id="trialbox" :hidden="c.S.tipo !== 'prueba'">
          <span class="ico"><Icon name="gift" /></span>
          <div><b>{{ t('Prueba de 15 días, sin pago') }}</b><p>{{ t('No te pedimos tarjeta. Al terminar la prueba decides si compras un plan.') }}</p></div>
        </div>
        <TextField id="email" v-model="c.email.value" :label="t('¿A qué correo te enviamos el QR?')" icon="mail" :state="c.email.state" type="email" inputmode="email" autocomplete="email" placeholder="hola@correo.com" spellcheck="false" @input="c.checkMail(false)" @blur="c.checkMail(true)" @keydown="onEnter">
          <template #help>
            <p v-if="c.email.help === 'sug'" class="fhelp" id="emailHelp">{{ t('¿Quisiste decir') }} <span class="sug" role="button" tabindex="0" @click="c.useSuggestion()">{{ c.email.sug }}</span>?</p>
            <p v-else class="fhelp" :class="{ bad: c.email.help === 'bad' }" id="emailHelp">{{ t(c.email.help === 'bad' ? 'Ese correo no parece válido. Revisa que tenga @ y un dominio.' : 'Revisa que esté bien escrito: ahí llega tu código de instalación.') }}</p>
          </template>
        </TextField>
      </div>
</template>

<style scoped>
.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--zn-space-12);margin:var(--zn-space-8) 0 var(--zn-space-8)}
.fhelp{font:var(--zn-weight-regular) 13px/18px var(--font-sans);color:var(--color-muted)}
.fhelp.bad{color:var(--color-alert)}
.fhelp .sug{color:var(--color-signal);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
@media (max-width:640px){
  .plans{grid-template-columns:1fr}
}
</style>
