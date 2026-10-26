<script setup>
/* Checkout · paso 1: tipo de licencia y confirmación de que se recibe un QR. */
import { inject } from 'vue'
import RadioCard from '@/design-system/components/RadioCard.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const c = inject('checkout')
const OPTS = [
  { value: 'prueba', icon: 'gift', tone: 'signal', title: '15 días de prueba', text: 'Quiero probar Zi0n sin compromiso.', tag: 'Gratis' },
  { value: 'activacion', icon: 'key', tone: 'aurora', title: 'Activación', text: 'Ya tengo una licencia instalada sin activar.' },
  { value: 'renovacion', icon: 'refresh', tone: 'aurora', title: 'Renovación', text: 'Se venció la licencia de mi dispositivo.' },
  { value: 'restauracion', icon: 'restore', tone: 'alert', title: 'Restauración', text: 'Mi dispositivo se borró y necesito restaurarlo.' }
]
</script>

<template>
      <div class="step" data-step="1">
        <p class="kicker kick" data-k="1">{{ c.kick(1) }}</p>
        <h1 class="h2">{{ t('¿Qué necesitas hoy?') }}</h1>
        <p class="lead">{{ t('Elige el tipo de licencia. Con eso armamos tu instalación.') }}</p>
        <div class="opts" role="radiogroup" :aria-label="t('Tipo de licencia')">
          <RadioCard v-for="o in OPTS" :key="o.value" v-model="c.S.tipo" variant="option" name="tipo" :value="o.value" :icon="o.icon" :tone="o.tone" :title="t(o.title)" :text="t(o.text)" :tag="o.tag ? { label: t(o.tag), tone: 'signal' } : null" />
        </div>
        <div class="note">
          <span class="ico"><Icon name="device-mobile" /></span>
          <p>{{ t('Zi0n funciona en dispositivos Samsung con eSIM. En otros modelos puede presentar fallos.') }}</p>
        </div>
        <label :ref="(el) => (c.ackEl = el)" class="ack">
          <input type="checkbox" id="ack" v-model="c.S.ack"><span class="box"><Icon name="check" /></span>
          <span>{{ t('Sé que recibiré un') }} <b>{{ t('código QR en mi correo') }}</b> {{ t('para instalar Zi0n. No estoy comprando un dispositivo.') }}</span>
        </label>
      </div>
</template>

<style scoped>
.opts{display:grid;gap:var(--zn-space-10);margin-top:var(--zn-space-8)}
.note{display:flex;gap:var(--zn-space-12);align-items:flex-start;padding:var(--zn-space-14) var(--zn-space-16);border-radius:var(--zn-radius-14);background:rgba(var(--rgb-aurora),.1);border:1px solid rgba(var(--rgb-aurora),.3);font:var(--zn-weight-regular) 14px/20px var(--font-sans);color:var(--color-ice)}
.note .ico{width:20px;height:20px;color:var(--color-aurora);margin-top:1px}
.ack{display:flex;gap:var(--zn-space-12);align-items:flex-start;cursor:pointer;font:var(--zn-weight-regular) 15px/22px var(--font-sans);color:var(--color-ice)}
.ack b{color:var(--color-mist);font-weight:var(--zn-weight-semibold)}
.ack input{position:absolute;opacity:0}
.box{width:22px;height:22px;margin-top:1px;border-radius:var(--zn-radius-6);border:1.5px solid var(--color-line-strong);display:grid;place-items:center;color:var(--color-ink);transition:var(--dur-fast);flex:none}
.box svg{width:14px;height:14px;opacity:0;transform:scale(.5);transition:var(--dur-fast) var(--ease);stroke-width:2.6}
.ack input:checked+.box{background:var(--color-signal);border-color:var(--color-signal)}
.ack input:checked+.box svg{opacity:1;transform:none}
.ack input:focus-visible+.box{outline:2px solid var(--color-signal);outline-offset:2px}
.ack.shake{animation:shake .4s}
@keyframes shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
</style>
